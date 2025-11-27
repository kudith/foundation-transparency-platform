import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine which .env file to load based on NODE_ENV
const env = process.env.NODE_ENV || "development";
const envFile = `.env.${env}`;
const envPath = path.resolve(__dirname, "..", envFile);

// Load environment variables from specific env file
dotenv.config({ path: envPath });

// Fallback to default .env if specific env file doesn't exist
if (!process.env.PORT) {
  dotenv.config();
}

const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  r2: {
    endpoint: process.env.R2_ENDPOINT,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucket: process.env.R2_BUCKET,
    publicUrl: process.env.R2_PUBLIC_URL,
    region: process.env.R2_REGION || "auto",
  },
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
    accessMaxAge: 15 * 60 * 1000, // 15 minutes for access token
  },
  cors: {
    origin:
      process.env.FRONTEND_URL ||
      process.env.CLIENT_URL ||
      "http://localhost:5173",
    credentials: true,
  },
  bcrypt: {
    rounds: Number.parseInt(process.env.BCRYPT_ROUNDS, 10) || 10,
  },
};

// Validate required config
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  console.error(`Current environment: ${env}`);
  console.error(`Looking for file: ${envPath}`);
  process.exit(1);
}

console.log(`Loaded configuration for environment: ${env}`);

export default config;
