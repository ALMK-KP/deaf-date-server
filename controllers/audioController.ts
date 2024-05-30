import "dotenv/config";
import { convertVideoToAudio } from "../services/convertVideoToAudio";
import { uploadAudioFile } from "../services/uploadAudioFile";

export async function getLinkToAudioFile(playlistId: string, ytVideoId: string) {
  const fileConvertedToAudio = convertVideoToAudio(ytVideoId);

  return await uploadAudioFile(fileConvertedToAudio, playlistId);
}
