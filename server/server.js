import express from "express";
import connectDatabase from "./config/MongoDb.js";
import dotenv from "dotenv";
import { errorHandler, notFound } from "./Middleware/Error.js";
import userRouter from "./Routes/UserRoute.js";
import taskRouter from "./Routes/TaskRoute.js";

dotenv.config();
const app = express();
connectDatabase();
app.use(express.json());

//API routes
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`server run in port http://localhost:${PORT}`);
});
