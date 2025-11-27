import { S3Client, PutObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import config from "./index.js";
import crypto from "crypto";

// R2 Client Configuration
const r2Client = new S3Client({
  region: config.r2.region || "auto",
  endpoint: config.r2.endpoint,
  credentials: {
    accessKeyId: config.r2.accessKeyId,
    secretAccessKey: config.r2.secretAccessKey,
  },
});

/**
 * Upload image to R2
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} mimetype - File mimetype
 * @param {string} folder - Folder name in R2 bucket
 * @returns {Promise<object>} Upload result with url and key
 */
export const uploadToR2 = async (fileBuffer, mimetype, folder = "events") => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString("hex");
    const extension = mimetype.split("/")[1];
    const filename = `${timestamp}-${randomString}.${extension}`;
    const objectKey = `${folder}/${filename}`;

    const command = new PutObjectCommand({
      Bucket: config.r2.bucket,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: mimetype,
    });

    await r2Client.send(command);

    // Construct public URL
    const publicUrl = `${config.r2.publicUrl}/${objectKey}`;

    return {
      url: publicUrl,
      key: objectKey,
    };
  } catch (error) {
    console.error("R2 upload error:", error);
    throw new Error("Failed to upload image to R2");
  }
};

/**
 * Delete image from R2
 * @param {string} key - Object key in R2
 * @returns {Promise<object>} Delete result
 */
export const deleteFromR2 = async (key) => {
  try {
    const command = new DeleteObjectsCommand({
      Bucket: config.r2.bucket,
      Delete: {
        Objects: [{ Key: key }],
      },
    });

    const result = await r2Client.send(command);
    return result;
  } catch (error) {
    console.error("R2 delete error:", error);
    throw new Error("Failed to delete image from R2");
  }
};

/**
 * Delete multiple images from R2
 * @param {Array<string>} keys - Array of object keys
 * @returns {Promise<object>} Delete result
 */
export const deleteMultipleFromR2 = async (keys) => {
  try {
    const command = new DeleteObjectsCommand({
      Bucket: config.r2.bucket,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
      },
    });

    const result = await r2Client.send(command);
    return result;
  } catch (error) {
    console.error("R2 bulk delete error:", error);
    throw new Error("Failed to delete images from R2");
  }
};

export default r2Client;




