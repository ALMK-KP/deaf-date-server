import ytdl from "ytdl-core";
import "dotenv/config";
import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export async function convertVideoToAudio(ytVideoId: string) {
  try {
    const stream = ytdl(`https://www.youtube.com/watch?v=${ytVideoId}`, {
      filter: "audioonly",
    });

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
        Key: `${Date.now().toString()}-audio.mp3`,
        Body: stream,
        ContentType: "audio/mpeg",
      },
    });

    upload.on("httpUploadProgress", (progress) => {
      console.log(
        `Uploaded ${progress.loaded} bytes out of ${progress.total} bytes`,
      );
    });

    const result = await upload.done();
    const message = `Upload completed: ${JSON.stringify(result)}`;
    console.log(message);

    // TODO: use better  E.g.: RFC 7807
    return { message };
  } catch (error: any) {
    const message = `Error uploading to S3: ${error.message}`;
    console.error(message);
    // TODO: use better  E.g.: RFC 7807
    return { message };
  }
}
