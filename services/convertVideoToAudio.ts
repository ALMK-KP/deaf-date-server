import ytdl from "ytdl-core";

export const convertVideoToAudio = (ytVideoId: string) =>
  ytdl(`https://www.youtube.com/watch?v=${ytVideoId}`, {
    filter: "audioonly",
  });
