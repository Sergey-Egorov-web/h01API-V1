import express, { Request, Response } from "express";

import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 5000;

const videos = [
  {
    id: 1,
    title: "Пример видео",
    author: "Автор",
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: "2023-10-01T12:00:00Z",
    publicationDate: "2023-10-02T12:00:00Z",
    availableResolutions: ["720p", "1080p"],
  },
  {
    id: 2,
    title: "My video",
    author: "Serj",
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: "2024-11-14T21:22:00Z",
    publicationDate: "2024-11-14T21:25:00Z",
    availableResolutions: ["720p"],
  },
];

const parserMiddleware = bodyParser({});
app.use(parserMiddleware);

app.get("/", (req: Request, res: Response) => {
  let helloMessage = "version 0.01!!!";
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
  if (!req.body.title || !req.body.author || !req.body.availableResolutions) {
    return res.status(400).send({
      errorsMessages: [
        {
          message: "Required fields are missing",
          field: "title, author, availableResolutions",
        },
      ],
    });
  }

  const newVideo = {
    id: +new Date(),
    title: req.body.title,
    author: req.body.author,
    canBeDownloaded:
      req.body.canBeDownloaded !== undefined ? req.body.canBeDownloaded : true, // Значение по умолчанию: true
    minAgeRestriction:
      req.body.minAgeRestriction !== undefined
        ? req.body.minAgeRestriction
        : null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions: req.body.availableResolutions,
  };
  videos.push(newVideo);
  res.status(201).send(newVideo);
});

app.put("/videos/:id", (req: Request, res: Response) => {
  let video = videos.find((p) => p.id === +req.params.id);

  if (!video) {
    res.send(404);
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
    res.status(200).send(video);
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

app.listen(port, () => {
  console.log(`HO1API-V1 app listening on port ${port}`);
});
