import * as fs from "fs";
import ytdl from "ytdl-core";

export function convertVideoToAudio(ytVideoId: string) {
  ytdl(`https://www.youtube.com/watch?v=${ytVideoId}`, {
    filter: "audioonly",
  }).pipe(fs.createWriteStream("test.mp3"));
  return "TODO";
}
