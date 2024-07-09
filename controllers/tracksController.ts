import "dotenv/config";
import { convertVideoToAudio } from "../services/convertVideoToAudio";
import { uploadAudioFile } from "../services/uploadAudioFile";

export async function addTrackToPlaylist(
  playlistId: string,
  ytVideoId: string,
) {
  // TODO: addTrackToPlaylist DB
  const fileConvertedToAudio = convertVideoToAudio(ytVideoId);
  return await uploadAudioFile(fileConvertedToAudio, playlistId);
}

// export async function getAudioFile(fileName: string) {
//   const downloadLink = `https://deaf-date-yt.s3.eu-north-1.amazonaws.com/${fileName}`;
// }



