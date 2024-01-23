import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { GetObjectCommand } from "@aws-sdk/client-s3";
export async function downloadFromS3(file_key: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const s3 = new S3Client({
        region: "ap-south-1",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY_ID!,
        },
      });
      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
      };

      const obj = await s3.send(new GetObjectCommand(params));
      const file_name = `/temp/elliott${Date.now().toString()}.pdf`;

      if (obj.Body instanceof require("stream").Readable) {
        const file = fs.createWriteStream(file_name);
        file.on("open", function (fd) {
          // @ts-ignore
          obj.Body?.pipe(file).on("finish", () => {
            return resolve(file_name);
          });
        });
      }
    } catch (error) {
      console.error(error);
      reject(error);
      return null;
    }
  });
}