import "dotenv/config";
import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Readable } from "stream";

export async function uploadAudioFile(fileStream: Readable, playlistId: string) {
  try {
    if (
      !process.env.S3_REGION ||
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY ||
      !process.env.S3_BUCKET
    ) {
      // TODO: use better  E.g.: RFC 7807
      return { message: "MISSING CREDENTIALS" };
    }

    const s3Config: S3ClientConfig = {
      region: process.env.S3_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    };

    const upload = new Upload({
      client: new S3Client(s3Config),
      params: {
        Bucket: process.env.S3_BUCKET!,
        Key: `${playlistId}-${Date.now().toString()}.mp3`,
        Body: fileStream,
        ContentType: "audio/mpeg",
      },
    });

    const { Key: fileName } = await upload.done();

    console.log(`Uploaded file: ${fileName}`);
    // TODO: use better  E.g.: RFC 7807
    return { fileName };
  } catch (error: any) {
    const errorMessage = `Error uploading to S3: ${error.message}`;
    console.error(errorMessage);
    // TODO: use better  E.g.: RFC 7807
    return { errorMessage };
  }
}
