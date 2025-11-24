import { createClient } from "redis";
import config from "./index.js";

let redisClient = null;

export const initRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URI || "redis://localhost:6379",
    });

    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    redisClient.on("connect", () => {
      console.log("Redis Client Connected");
    });

    redisClient.on("ready", () => {
      console.log("Redis Client Ready");
    });

    await redisClient.connect();
    console.log("Redis initialized successfully");

    return redisClient;
  } catch (error) {
    console.error("Failed to initialize Redis:", error);
    throw error;
  }
};

export const getRedisClient = () => {
  if (!redisClient) {
    throw new Error("Redis client not initialized. Call initRedis() first.");
  }
  return redisClient;
};

export const closeRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    console.log("Redis connection closed");
  }
};

export default { initRedis, getRedisClient, closeRedis };
