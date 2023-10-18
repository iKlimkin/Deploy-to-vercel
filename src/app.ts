import { getTestsRouter } from "./routes/tests";
import { getVideosRouter } from "./routes/videos";
import { videoDb } from "./db/videoDb";
import express from "express";

export const app = express();
const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

app.use("/videos", getVideosRouter(videoDb));
app.use("/testing", getTestsRouter(videoDb));
