import config from "./config/index.js";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import createWebServer from "./config/web.js";

// Load environment variables
dotenv.config();

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Create web server
    const app = createWebServer();

    // Start listening
    const server = app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
      console.log(`Environment: ${config.env}`);
      console.log(`API URL: http://localhost:${config.port}/api`);
    });

    // Graceful shutdown
    const gracefulShutdown = () => {
      console.log("\nReceived shutdown signal, closing server gracefully...");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error(
          "Could not close connections in time, forcefully shutting down"
        );
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
