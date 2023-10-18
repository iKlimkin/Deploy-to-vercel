import { Request, Response, Router } from "express";
import { HTTP_STATUSES } from "../statuses";
import { VideoType } from "../db/videoDb";

export const getTestsRouter = (videoDb: VideoType[]) => {
  const router = Router();

  router.delete("/all-data", (req: Request, res: Response) => {
    videoDb.length = 0;
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  });

  return router;
};
