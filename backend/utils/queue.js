import { getRedisClient } from "../config/redis.js";

/**
 * Push image processing job to Redis queue
 * @param {string} imageJobID - Image job ID to process
 * @returns {Promise<void>}
 */
export const pushImageProcessingJob = async (imageJobID) => {
  try {
    const redis = getRedisClient();
    
    const payload = {
      task_type: "process_image",
      payload: {
        imageJobID,
      },
    };

    // Push to Redis list (task_queue)
    await redis.lPush("task_queue", JSON.stringify(payload));
    
    console.log(`Pushed image processing job to queue: ${imageJobID}`);
  } catch (error) {
    console.error("Error pushing job to Redis queue:", error);
    throw new Error(`Failed to push job to queue: ${error.message}`);
  }
};

/**
 * Get queue length
 * @returns {Promise<number>}
 */
export const getQueueLength = async () => {
  try {
    const redis = getRedisClient();
    return await redis.lLen("task_queue");
  } catch (error) {
    console.error("Error getting queue length:", error);
    return 0;
  }
};







