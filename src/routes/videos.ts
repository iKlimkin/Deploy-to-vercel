import { CreateVideoModel } from "../models/CreateVideoModel";
import { Request, Response, Router } from "express";
import { URIParamsVideoModel } from "../models/URIParamsVideoModel";
import { UpdateVideoModel } from "../models/UpdateVideoModel";
import { VideoViewModel } from "../models/VideoViewModel";
import { HTTP_STATUSES } from "../statuses";
import {
  RequestWithParams,
  RequestWithBody,
  RequestWithBodyAndParams,
} from "../types";
import { AvailableResolutions, VideoType } from "../db/videoDb";
import { ErrorType } from "../errorHandling/customErrors";
import { createErrorMessage } from "../errorHandling/errorHandler";

const getVideoViewModel = (video: VideoType): VideoViewModel => {
  return {
    id: video.id,
    title: video.title,
    author: video.author,
    canBeDownloaded: video.canBeDownloaded,
    minAgeRestriction: video.minAgeRestriction,
    createdAt: video.createdAt,
    publicationDate: video.publicationDate,
    availableResolutions: video.availableResolutions,
  };
};


export const getVideosRouter = (videoDb: VideoType[]) => {
  const router = Router();

  router.get("/", (req: Request, res: Response<VideoViewModel[]>) => {
    res.send(videoDb.map(getVideoViewModel));
  });

  router.get(
    "/:id",
    (
      req: RequestWithParams<URIParamsVideoModel>,
      res: Response<VideoViewModel>
    ) => {
      const id = +req.params.id;

      const video = videoDb.find((video: VideoType) => video.id === id);
      if (!video) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
      }

      res.send(getVideoViewModel(video));
    }
  );

  router.post("/", (req: RequestWithBody<CreateVideoModel>, res: Response) => {
    let { title, author, availableResolutions } = req.body;
    let errors: ErrorType = {
        errorsMessages: [],
      };
      
    if (
      !title ||
      typeof title !== "string" ||
      !title.trim() ||
      title.length > 40
    ) errors.errorsMessages.push(createErrorMessage("title"));
      
    
    if (
      !author ||
      typeof author !== "string" ||
      !author.trim() ||
      author.length > 20
    ) errors.errorsMessages.push(createErrorMessage("author"));
      
    
    if (
      !availableResolutions ||
      !Array.isArray(availableResolutions) ||
      !availableResolutions.every((el) =>
        Object.values(AvailableResolutions).includes(el)
      )
    ) errors.errorsMessages.push(createErrorMessage("availableResolutions"));
     

    if (errors.errorsMessages.length) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors);
      return;
    }

    const createdAt = new Date();
    const publicationDate = new Date();

    publicationDate.setDate(createdAt.getDate() + 1);

    const newVideo: VideoType = {
      id: +new Date(),
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: createdAt.toISOString(),
      publicationDate: publicationDate.toISOString(),
      title,
      author,
      availableResolutions,
    };

    videoDb.push(newVideo);

    res.status(HTTP_STATUSES.CREATED_201).send(getVideoViewModel(newVideo));
  });
  router.put(
    "/:id",
    (
      req: RequestWithBodyAndParams<URIParamsVideoModel, UpdateVideoModel>,
      res: Response
    ) => {
      let {
        title,
        author,
        availableResolutions,
        canBeDownloaded,
        minAgeRestriction,
        publicationDate,
      } = req.body;
      
      const id = +req.params.id;

      let errors: ErrorType = {
        errorsMessages: [],
      };

      if (
        !title ||
        typeof title !== "string" ||
        !title.trim() ||
        title.trim().length > 40
      ) errors.errorsMessages.push(createErrorMessage("title"));


      if (
        !author ||
        typeof author !== "string" ||
        !author.trim() ||
        author.trim().length > 20
      ) errors.errorsMessages.push(createErrorMessage("author"));
       
      
      if (
        !availableResolutions ||
        !Array.isArray(availableResolutions) ||
        !availableResolutions.every((el) =>
          Object.values(AvailableResolutions).includes(el)
        )
      ) errors.errorsMessages.push(createErrorMessage("availableResolutions"));
       
      
      if (
        typeof canBeDownloaded !== "undefined" &&
        typeof canBeDownloaded !== "boolean"
      ) errors.errorsMessages.push(createErrorMessage("canBeDownloaded"));
       

      if (
        typeof minAgeRestriction === "undefined" ||
        typeof minAgeRestriction !== "number" ||
        minAgeRestriction < 1 ||
        minAgeRestriction > 18
      ) errors.errorsMessages.push(createErrorMessage("minAgeRestriction"));
    
      if (!publicationDate || typeof publicationDate !== "string") errors.errorsMessages.push(createErrorMessage("publicationDate"));
        
      if (errors.errorsMessages.length) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors);
        return;
      }

      let video = videoDb.find((video: VideoType) => video.id === id);

      if (!video) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
      }

      video.title = title;
      video.author = author;
      video.availableResolutions = availableResolutions;
      video.canBeDownloaded = canBeDownloaded || false;
      video.minAgeRestriction = minAgeRestriction;
      video.publicationDate = publicationDate;

      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
  );

  router.delete(
    "/:id",
    (req: RequestWithParams<URIParamsVideoModel>, res: Response) => {
      const id = +req.params.id;
      const indexVideo = videoDb.findIndex(
        (video: VideoType) => video.id === id
      );
      if (indexVideo === -1) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
      }

      videoDb.splice(indexVideo, 1);
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
  );

  return router;
};
