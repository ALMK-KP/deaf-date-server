import "dotenv/config";
import { convertVideoToAudio } from "../services/convertVideoToAudio";
import { uploadAudioFile } from "../services/uploadAudioFile";
import { IAddTrackToPlaylistRequest, ITrack } from "../utils/interfaces";
import { nanoid } from "nanoid";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const addTrackToPlaylist = async (req: any, res: any) => {
  try {
    let playlistId = req.body.playlistId;
    if (!req.body.playlistId) {
      playlistId = nanoid(11);
    }

    const isValidBody = (
      body: IAddTrackToPlaylistRequest,
    ): body is IAddTrackToPlaylistRequest => !!body?.ytId;
    if (!req.body || !isValidBody(req.body)) {
      return res.status(422).send("Incorrect payload");
    }

    const isAlreadyExistingInGivenPlaylist = await prisma.track.findFirst({
      where: { ytId: req.body.ytId, playlistId },
    });
    if (isAlreadyExistingInGivenPlaylist) {
      return res.status(409).send("Track already exists in this playlist");
    }

    const fileConvertedToAudio = convertVideoToAudio(req.body.ytId);
    const s3Response = await uploadAudioFile(fileConvertedToAudio, playlistId);
    if (s3Response.errorMessage) {
      return res.status(500).send(s3Response.errorMessage);
    }

    const allTracksInPlaylistBefore = await prisma.track.findMany({
      where: { playlistId },
    });

    const customTitle = `#${allTracksInPlaylistBefore.length + 1}`;

    const track: ITrack = {
      ...req.body,
      playlistId,
      customTitle,
      audio: s3Response.fileName,
    };
    await prisma.track.create({
      data: { ...track },
    });

    const allTracksInPlaylistAfter = await prisma.track.findMany({
      where: { playlistId },
    });

    return res.status(201).send({ data: allTracksInPlaylistAfter });
  } catch (err) {
    return res.status(500).send(err);
  }
};

// export async function getAudioFile(fileName: string) {
//   const downloadLink = `https://deaf-date-yt.s3.eu-north-1.amazonaws.com/${fileName}`;
// }

export { addTrackToPlaylist };
