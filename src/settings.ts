import express, { Request, Response, Router } from "express";

export const app = express();

app.use(express.json());

type RequestWithParams<P> = Request<P, {}, {}, {}>;
type RequestWithBody<B> = Request<{}, {}, B, {}>;
type RequestWithBodyAndParams<P, B> = Request<P, {}, B, {}>;

type ErrorsMessages = {
  message: string;
  field: string;
};
type ErrorType = {
  errorsMessages: ErrorsMessages[];
};
enum AvailableResolutions {
  P144 = "P144",
  P240 = "P144",
  P360 = "P144",
  P480 = "P480",
  P720 = "P480",
  P1080 = "P480",
  P1440 = "P1440",
  P2160 = "P1440",
}

type VideoType = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: AvailableResolutions[];
};

const videoDb: VideoType[] = [
  {
    id: 0,
    title: "string",
    author: "string",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: "2023-10-13T09:15:13.907Z",
    publicationDate: "2023-10-13T09:15:13.907Z",
    availableResolutions: [
        AvailableResolutions.P144
    ],
  },
];

export const videosRouter = Router();

app.use("/videos", videosRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("IT-INCUBATOR!");
});

videosRouter.get("/", (req: Request, res: Response) => {
  res.send(videoDb);
});
videosRouter.get("/:id",(req: RequestWithParams<{ id: number }>, res: Response) => {
    const id = +req.params.id;
    const video = videoDb.find((video: VideoType) => video.id === id);
    if (!video) {
      res.sendStatus(404);
      return;
    }

    res.send(video);
  }
);

videosRouter.post("/", (req: RequestWithBody<
    {
      title: string;
      author: string;
      availableResolutions: AvailableResolutions[];
    }>, res: Response) => {

    let errors: ErrorType = {
      errorsMessages: [],
    };

    let { title, author, availableResolutions } = req.body;

    if (!title || title.trim().length > 40) {
      errors.errorsMessages.push({ message: "Invalid title", field: "title" });
    }
    if (!author || author.trim().length > 20) {
      errors.errorsMessages.push({
        message: "Invalid author",
        field: "author",
      });
    }

    if (Array.isArray(availableResolutions) && availableResolutions.length) {
      availableResolutions.map((r: AvailableResolutions) => {
        !AvailableResolutions[r] && errors.errorsMessages.push({
            message: "Invalid availableResolutions",
            field: "availableResolutions",
          });
      });
    } else {
      availableResolutions = [];
    }

    if (errors.errorsMessages.length) {
      res.status(400).send(errors);
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

    res.status(201).send(newVideo);
    });
videosRouter.put("/:id",( req: RequestWithBodyAndParams<{ id: number },
      {
        title: string;
        author: string;
        availableResolutions: AvailableResolutions[];
        canBeDownloaded: boolean;
        minAgeRestriction: number;
        publicationDate: string;
      }
    >, res: Response) => {
    const {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body;

    let errors: ErrorType = {
      errorsMessages: [],
    };

    const id = +req.params.id;
    let video = videoDb.find((video: VideoType) => video.id === id);

    if (!video) {
      res.sendStatus(404);
      return;
    } else {
      if (!title || !title.trim().length || title.trim().length > 40) {
        errors.errorsMessages.push({
          message: "Invalid title",
          field: "title",
        });
      }
      if (!author || !author.trim().length || author.trim().length > 20) {
        errors.errorsMessages.push({
          message: "Invalid title",
          field: "title",
        });
      }
      if (Array.isArray(availableResolutions) && availableResolutions.length) {
        availableResolutions.map((r: AvailableResolutions) => {
          !AvailableResolutions[r] &&
            errors.errorsMessages.push({
              message: "Invalid availableResolutions",
              field: "availableResolutions",
            });
        });
      } 
      if ((typeof canBeDownloaded !== "undefined" &&typeof canBeDownloaded !== "boolean") || typeof canBeDownloaded === "undefined") {
        errors.errorsMessages.push({
          message: "Invalid canBeDownLoaded",
          field: "canBeDownLoaded",
        });
      }
      if (typeof minAgeRestriction === "undefined" || typeof minAgeRestriction !== "number" || minAgeRestriction < 1 || minAgeRestriction > 18) {
        errors.errorsMessages.push({
          message: "Invalid minAgeRestriction",
          field: "minAgeRestriction",
        });
      }
      if (!publicationDate || typeof publicationDate !== "string") {
         errors.errorsMessages.push({
          message: "Invalid publicationDate",
          field: "publicationDate",
        });
      }

      if (errors.errorsMessages.length) {
        res.status(400).send(errors);
      } else {
        video.title = title;
        video.author = author;
        video.availableResolutions = availableResolutions;
        video.canBeDownloaded = canBeDownloaded || false;
        video.publicationDate = publicationDate;

        res.sendStatus(204);
      }
    }
  }
);

videosRouter.delete("/:id", (req: RequestWithParams<{ id: number }>, res: Response) => {
  const id = +req.params.id;
  const indexVideo = videoDb.findIndex((video: VideoType) => video.id === id);
    if (indexVideo === -1) {
      res.sendStatus(404);
      return;
    } else {
      videoDb.splice(indexVideo, 1);
      res.sendStatus(204);
    }
});

app.delete("/testing/all-data", (res: Response, req: Request) => {
  videoDb.length = 0;
  res.sendStatus(204);
});
