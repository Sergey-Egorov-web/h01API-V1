import express, { Request, Response } from "express";

import bodyParser from "body-parser";

export const app = express();
// const port = process.env.PORT || 5000;

function isValidResolution(resolution: string): boolean {
  const validResolutions = [
    "P144",
    "P240",
    "P360",
    "P480",
    "P720",
    "P1080",
    "P1440",
    "P2160",
  ];
  return validResolutions.includes(resolution);
}

let videos = [
  {
    id: 1,
    title: "Example video",
    author: "Author",
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: "2023-10-01T12:00:00Z",
    publicationDate: "2023-10-02T12:00:00Z",
    availableResolutions: ["720p", "1080p"],
  },
  // {
  //   id: 2,
  //   title: "My video",
  //   author: "Ivan",
  //   canBeDownloaded: false,
  //   minAgeRestriction: null,
  //   createdAt: "2024-11-14T21:22:00Z",
  //   publicationDate: "2024-11-14T21:25:00Z",
  //   availableResolutions: ["720p"],
  // },
];

const parserMiddleware = bodyParser({});
app.use(parserMiddleware);
// app.use(express.json()); // используем вместо bodyParser

app.get("/", (req: Request, res: Response) => {
  let helloMessage = "version 0.02!!!";
  res.send(helloMessage);
});

app.get("/videos", (req: Request, res: Response) => {
  //   if (req.query.title) {
  //     let searchString = req.query.title.toString();
  //     res.send(videos.filter((p) => p.title.indexOf(searchString) > -1));
  //   } else {
  res.send(videos);
  //   }
});

app.get("/videos/:id", (req: Request, res: Response) => {
  let video = videos.find((p) => p.id === +req.params.id);
  if (video) {
    res.send(video);
  } else res.send(404);
});

app.post("/videos", (req: Request, res: Response) => {
  if (
    !req.body.title ||
    !req.body.author ||
    !req.body.availableResolutions ||
    req.body.title.length > 40 ||
    req.body.author.length > 20 ||
    !Array.isArray(req.body.availableResolutions) ||
    req.body.availableResolutions.length === 0 ||
    !req.body.availableResolutions.every(isValidResolution)
  ) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "Required fields are missing",
          field: "title, author, availableResolutions",
        },
      ],
    });
    return;
  }

  const createdAt = new Date();
  const publicationDate = new Date(createdAt);
  publicationDate.setDate(createdAt.getDate() + 1);

  const newVideo = {
    id: +new Date(),
    title: req.body.title,
    author: req.body.author,
    canBeDownloaded:
      req.body.canBeDownloaded !== undefined ? req.body.canBeDownloaded : false, // Default value: false
    minAgeRestriction:
      req.body.minAgeRestriction !== undefined
        ? req.body.minAgeRestriction
        : null,
    createdAt: createdAt.toISOString(),
    publicationDate: publicationDate.toISOString(),
    availableResolutions: req.body.availableResolutions,
  };
  videos.push(newVideo);
  res.status(201).send(newVideo);
});

app.put("/videos/:id", (req: Request, res: Response) => {
  let video = videos.find((p) => p.id === +req.params.id);

  if (!req.body.title || !req.body.author || !req.body.availableResolutions) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "Required fields are missing",
          field: "title, author, availableResolutions",
        },
      ],
    });
    return;
  }

  if (!video) {
    res.sendStatus(404);
  } else {
    // const errorsMessages: { message: string; field: string }[] = [];

    // if (
    //   // !req.body.title ||
    //   // typeof req.body.title !== "string" ||
    //   req.body.title.length > 40
    // ) {
    //   errorsMessages.push({
    //     message: "Invalid title",
    //     field: "title",
    //   });
    // }

    // if (
    //   // !req.body.author ||
    //   // typeof req.body.author !== "string" ||
    //   req.body.author.length > 20
    // ) {
    //   errorsMessages.push({
    //     message: "Invalid author",
    //     field: "author",
    //   });
    // }

    // if (errorsMessages.length > 0) {
    //   return res.status(400).send({ errorsMessages });
    // }

    if (req.body.title) {
      video.title = req.body.title.toString();
    }
    if (req.body.author) {
      video.author = req.body.author.toString();
    }

    if (req.body.canBeDownloaded) {
      video.canBeDownloaded = req.body.canBeDownloaded.toString();
    }
    if (req.body.minAgeRestriction) {
      video.minAgeRestriction = req.body.minAgeRestriction.toString();
    }

    if (req.body.availableResolutions) {
      video.availableResolutions = req.body.availableResolutions.toString();
    }
    res.sendStatus(204);
    // res.status(204).send(video);
    return;
  }
});

app.delete("/videos/:id", (req: Request, res: Response) => {
  for (let i = 0; i < videos.length; i++) {
    if (videos[i].id === +req.params.id) {
      videos.splice(i, 1);
      res.sendStatus(204);
      return;
    }
  }
  res.send(404);
});

app.delete("/testing/all-data", (req: Request, res: Response) => {
  videos = [];
  res.send(204);
});
