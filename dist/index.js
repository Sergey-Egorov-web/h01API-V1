"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
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
const parserMiddleware = (0, body_parser_1.default)({});
app.use(parserMiddleware);
app.get("/", (req, res) => {
    let helloMessage = "version 0.01!!!";
    res.send(helloMessage);
});
app.get("/videos", (req, res) => {
    //   if (req.query.title) {
    //     let searchString = req.query.title.toString();
    //     res.send(videos.filter((p) => p.title.indexOf(searchString) > -1));
    //   } else {
    res.send(videos);
    //   }
});
app.get("/videos/:id", (req, res) => {
    let video = videos.find((p) => p.id === +req.params.id);
    if (video) {
        res.send(video);
    }
    else
        res.send(404);
});
app.post("/videos", (req, res) => {
    const newVideo = {
        id: +new Date(),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: req.body.canBeDownloaded !== undefined ? req.body.canBeDownloaded : true, // Значение по умолчанию: true
        minAgeRestriction: req.body.minAgeRestriction !== undefined
            ? req.body.minAgeRestriction
            : null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: req.body.availableResolutions,
    };
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
app.listen(port, () => {
    console.log(`HO1API-V1 app listening on port ${port}`);
});
