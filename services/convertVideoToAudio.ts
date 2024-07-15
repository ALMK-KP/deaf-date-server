import ytdl from "@distube/ytdl-core";

export const convertVideoToAudio = (ytVideoId: string) =>
  ytdl(`https://www.youtube.com/watch?v=${ytVideoId}`, {
    filter: "audioonly",
    quality: "highestaudio",
  });
