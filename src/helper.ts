import db from "./config/db.ts";
import errorMiddleware from "./utils/errorMiddleware.ts";
import notFound from "./utils/notFound.ts";

import { Express } from "express";

const helper = (app: Express) => {
 
  // Middleware for handling not found errors
  app.use(notFound);
  // Error handling middleware
  app.use(errorMiddleware);
   db();
  app.listen(process.env.PORT!, () => {
    console.log(`Server is running on port ${process.env.PORT!}`);
  });

  process.on("uncaughtException", (err: Error) => {
    console.error("Uncaught Exception:", err);
    // Perform cleanup or exit the process if needed
    process.exit(1);
  });

  process.on("unhandledRejection", (err: Error) => {
    console.error("Unhandled Rejection:", err);
    // Handle or log the rejection here
  });
};

export default helper;
