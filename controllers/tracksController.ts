import "dotenv/config";
import { convertVideoToAudio } from "../services/convertVideoToAudio";
import { uploadAudioFile } from "../services/uploadAudioFile";
import {
  AddTrackToPlaylistRequest,
  TrackEncoded,
  TrackWithoutId,
} from "../utils/interfaces";
import { nanoid } from "nanoid";
import { PrismaClient, Track } from "@prisma/client";
import { KnowledgeLevelEnum } from "../utils/enums";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const addTrackToPlaylist = async (req: Request, res: Response) => {
  try {
    let playlistId = req.body.playlistId;
    if (!req.body.playlistId) {
      playlistId = nanoid(11);
    }

    const isValidBody = (
      body: AddTrackToPlaylistRequest,
    ): body is AddTrackToPlaylistRequest => !!body?.ytId;
    if (!req.body || !isValidBody(req.body)) {
      return res.status(422).send({ message: "Incorrect payload" });
    }

    const isAlreadyExistingInGivenPlaylist = await prisma.track.findFirst({
      where: { ytId: req.body.ytId, playlistId },
    });
    if (isAlreadyExistingInGivenPlaylist) {
      return res
        .status(409)
        .send({ message: "Track already exists in this playlist" });
    }

    const fileConvertedToAudio = convertVideoToAudio(req.body.ytId);
    const s3Response = await uploadAudioFile(fileConvertedToAudio, playlistId);
    if (s3Response.errorMessage) {
      return res.status(500).send({ message: s3Response.errorMessage });
    }

    const allTracksInPlaylistBefore = await prisma.track.findMany({
      where: { playlistId },
    });

    const customTitle = "";

    const track: TrackWithoutId = {
      ...req.body,
      playlistId,
      customTitle,
      order: allTracksInPlaylistBefore.length,
      audio: `${process.env.S3_URL}/${s3Response.fileName}`,
    };
    await prisma.track.create({
      data: track,
    });

    const allTracksInPlaylistAfter = await prisma.track.findMany({
      where: { playlistId },
    });

    const sortedTracksInPlaylistAfter = allTracksInPlaylistAfter.sort(
      (a, b) => a.order - b.order,
    );

    return res
      .status(201)
      .send({ playlistId, data: sortedTracksInPlaylistAfter });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

const updateTrackCustomTitle = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(422).send({ message: "Incorrect payload" });
    }

    if (!req.params || !req.params.id) {
      return res.status(422).send({ message: "Incorrect params" });
    }

    const { customTitle } = req.body;
    const trackId = +req.params.id;

    const track = await prisma.track.findFirst({
      where: { id: trackId },
    });
    if (!track) {
      return res
        .status(404)
        .send({ message: "There is no track with given id" });
    }

    await prisma.track.update({
      where: { id: trackId },
      data: { customTitle },
    });

    const allTracksInPlaylist = await prisma.track.findMany({
      where: { playlistId: track.playlistId },
    });

    const sortedTracksInPlaylistAfter = allTracksInPlaylist.sort(
      (a, b) => a.order - b.order,
    );

    return res.status(200).send({ data: sortedTracksInPlaylistAfter });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

const reorderTracks = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(422).send({ message: "Incorrect payload" });
    }

    if (!req.params || !req.params.id) {
      return res.status(422).send({ message: "Incorrect params" });
    }

    const { reorderedTracks } = req.body;
    const playlistId = req.params.id;

    const unorderedTracks = await prisma.track.findMany({
      where: { playlistId },
    });

    if (!unorderedTracks.length) {
      return res
        .status(404)
        .send({ message: "There is no playlist with given id" });
    }

    const updatePromises = unorderedTracks.map(({ id }) => {
      const updatedTrack = reorderedTracks.find(
        (track: Track) => track.id === id,
      );

      if (!updatedTrack) {
        // TODO: handle better
        return res.status(422).send({ message: "Incorrect payload" });
      }

      const updatedTrackId = reorderedTracks.findIndex(
        (track: Track) => track.id === id,
      );

      return prisma.track.update({
        where: { id },
        data: { order: updatedTrackId },
      });
    });

    await Promise.all(updatePromises);

    const allTracksInPlaylist = await prisma.track.findMany({
      where: { playlistId },
    });

    const sortedTracksInPlaylistAfter = allTracksInPlaylist.sort(
      (a, b) => a.order - b.order,
    );

    return res.status(200).send({ data: sortedTracksInPlaylistAfter });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

const getPlaylist = async (req: Request, res: Response) => {
  try {
    if (
      !req.params.id ||
      !req.query.knowledgeLevel ||
      !((+req.query.knowledgeLevel) in KnowledgeLevelEnum)
    ) {
      return res.status(422).send({ message: "Incorrect params" });
    }

    const { id } = req.params;
    const { knowledgeLevel } = req.query;

    let tracks: Track[] | TrackEncoded[] | null = null;
    if (+knowledgeLevel == KnowledgeLevelEnum.FULL) {
      tracks = await prisma.track.findMany({
        where: {
          playlistId: id,
        },
      });
    }
    if (+knowledgeLevel == KnowledgeLevelEnum.ENCODED) {
      tracks = await prisma.track.findMany({
        where: {
          playlistId: id,
        },
        select: {
          id: true,
          customTitle: true,
          audio: true,
          order: true,
        },
      });
    }
    console.log(tracks);

    if (!tracks) {
      return res
        .status(404)
        .send({ message: "There is no tracks in playlist with given id" });
    }

    const sortedTracksInPlaylistAfter = tracks.sort(
      (a, b) => a.order - b.order,
    );

    return res.status(200).send({
      playlistId: id,
      knowledgeLevel,
      data: sortedTracksInPlaylistAfter,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

const deleteTrackFromPlaylist = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(422).send({ message: "Incorrect params" });
    }

    const id = +req.params.id;
    const track = await prisma.track.findFirst({
      where: { id },
    });
    if (!track) {
      return res
        .status(404)
        .send({ message: "There is no track with given id" });
    }

    // TODO: remove track from s3

    await prisma.track.delete({
      where: {
        id,
      },
    });

    const allTracksInPlaylist = await prisma.track.findMany({
      where: { playlistId: track.playlistId },
    });

    const sortedTracksInPlaylistAfter = allTracksInPlaylist.sort(
      (a, b) => a.order - b.order,
    );

    return res.status(200).send({ data: sortedTracksInPlaylistAfter });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

const deletePlaylist = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(422).send({ message: "Incorrect params" });
    }

    const id = req.params.id;
    const tracksInPlaylist = await prisma.track.findMany({
      where: { playlistId: id },
    });
    if (!tracksInPlaylist.length) {
      return res
        .status(404)
        .send({ message: "There is no playlist with given id" });
    }

    // TODO: remove tracks from s3

    await prisma.track.deleteMany({
      where: {
        playlistId: id,
      },
    });

    return res.status(204).send({ data: [] });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

export {
  addTrackToPlaylist,
  updateTrackCustomTitle,
  getPlaylist,
  deleteTrackFromPlaylist,
  deletePlaylist,
  reorderTracks,
};
