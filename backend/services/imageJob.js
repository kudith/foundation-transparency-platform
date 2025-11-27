import ImageJob from "../models/imageJob.js";
import mongoose from "mongoose";
import { uploadToR2, deleteFromR2 } from "../config/r2.js";
import { pushImageProcessingJob } from "../utils/queue.js";

/**
 * Create image job and upload to R2 /raw folder
 * @param {Object} jobData - Job metadata (entityType, entityId)
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} mimetype - File mimetype
 * @param {string} originalFilename - Original filename
 * @returns {Promise<object>} Created image job
 */
export const createImageJob = async (
  jobData,
  fileBuffer,
  mimetype,
  originalFilename
) => {
  try {
    // Upload raw image to R2 /raw folder
    const uploadResult = await uploadToR2(fileBuffer, mimetype, "raw");

    // Create image job record (Mongoose will auto-generate ObjectID for _id)
    const imageJob = new ImageJob({
      entityType: jobData.entityType,
      entityId: jobData.entityId,
      sourceImageURL: uploadResult.url,
      sourceImageKey: uploadResult.key,
      originalFilename,
      mimetype,
      fileSize: fileBuffer.length,
      status: "PENDING", // UPPERCASE for worker
      errorMsg: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await imageJob.save();

    // Push job to Redis queue for worker processing
    // Convert ObjectID to string for Redis payload
    await pushImageProcessingJob(imageJob._id.toString());

    return imageJob;
  } catch (error) {
    console.error("Error creating image job:", error);
    throw new Error(`Failed to create image job: ${error.message}`);
  }
};

/**
 * Get image job by ID
 * @param {string} id - Image job ID
 * @returns {Promise<object>} Image job
 */
export const getImageJobById = async (id) => {
  const imageJob = await ImageJob.findById(id);
  if (!imageJob) {
    const error = new Error("Image job not found");
    error.statusCode = 404;
    throw error;
  }
  return imageJob;
};

/**
 * Get multiple image jobs by IDs
 * @param {Array<string>} ids - Array of image job IDs
 * @returns {Promise<Array>} Array of image jobs
 */
export const getImageJobsByIds = async (ids) => {
  if (!ids || ids.length === 0) {
    return [];
  }
  return await ImageJob.find({ _id: { $in: ids } });
};

/**
 * Get image jobs by entity
 * @param {string} entityType - Entity type (event, report, etc)
 * @param {string} entityId - Entity ID
 * @returns {Promise<Array>} Array of image jobs
 */
export const getImageJobsByEntity = async (entityType, entityId) => {
  return await ImageJob.find({ entityType, entityId }).sort({ createdAt: -1 });
};

/**
 * Update image job status (called by worker webhook/callback)
 * @param {string} id - Image job ID
 * @param {Object} updateData - Update data
 * @returns {Promise<object>} Updated image job
 */
export const updateImageJobStatus = async (id, updateData) => {
  const imageJob = await ImageJob.findById(id);
  if (!imageJob) {
    const error = new Error("Image job not found");
    error.statusCode = 404;
    throw error;
  }

  // Update fields
  if (updateData.status) imageJob.status = updateData.status;
  if (updateData.outputImageURL) imageJob.outputImageURL = updateData.outputImageURL;
  if (updateData.outputImageKey) imageJob.outputImageKey = updateData.outputImageKey;
  if (updateData.errorMsg) imageJob.errorMsg = updateData.errorMsg;
  
  imageJob.updatedAt = new Date();
  
  if (updateData.status === "completed" || updateData.status === "failed") {
    imageJob.processedAt = new Date();
  }

  await imageJob.save();
  return imageJob;
};

/**
 * Delete image job and its associated images from R2
 * @param {string} id - Image job ID
 * @returns {Promise<object>} Deleted image job
 */
export const deleteImageJob = async (id) => {
  const imageJob = await ImageJob.findById(id);
  if (!imageJob) {
    const error = new Error("Image job not found");
    error.statusCode = 404;
    throw error;
  }

  // Delete from R2
  const keysToDelete = [];
  if (imageJob.sourceImageKey) keysToDelete.push(imageJob.sourceImageKey);
  if (imageJob.outputImageKey) keysToDelete.push(imageJob.outputImageKey);

  if (keysToDelete.length > 0) {
    try {
      await Promise.all(keysToDelete.map((key) => deleteFromR2(key)));
    } catch (error) {
      console.error("Error deleting images from R2:", error);
      // Continue with deletion even if R2 delete fails
    }
  }

  await ImageJob.findByIdAndDelete(id);
  return imageJob;
};

/**
 * Retry failed image job
 * @param {string} id - Image job ID
 * @returns {Promise<object>} Updated image job
 */
export const retryImageJob = async (id) => {
  const imageJob = await ImageJob.findById(id);
  if (!imageJob) {
    const error = new Error("Image job not found");
    error.statusCode = 404;
    throw error;
  }

  if (imageJob.status !== "FAILED") {
    const error = new Error("Can only retry failed jobs");
    error.statusCode = 400;
    throw error;
  }

  // Reset status and clear error
  imageJob.status = "PENDING";
  imageJob.errorMsg = "";
  imageJob.updatedAt = new Date();
  await imageJob.save();

  // Push to queue again
  await pushImageProcessingJob(imageJob._id.toString());

  return imageJob;
};

