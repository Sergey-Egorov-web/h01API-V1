"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
exports.app = (0, express_1.default)();
// const port = process.env.PORT || 5000;
function isValidResolution(resolution) {
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
    {
        id: 2,
        title: "My video",
        author: "Ivan",
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: "2024-11-14T21:22:00Z",
        publicationDate: "2024-11-14T21:25:00Z",
        availableResolutions: ["720p"],
    },
];
const parserMiddleware = (0, body_parser_1.default)({});
exports.app.use(parserMiddleware);
// app.use(express.json()); // используем вместо bodyParser
exports.app.get("/", (req, res) => {
    let helloMessage = "version 0.02!!!";
    res.send(helloMessage);
});
exports.app.get("/videos", (req, res) => {
    //   if (req.query.title) {
    //     let searchString = req.query.title.toString();
    //     res.send(videos.filter((p) => p.title.indexOf(searchString) > -1));
    //   } else {
    res.send(videos);
    //   }
});
exports.app.get("/videos/:id", (req, res) => {
    let video = videos.find((p) => p.id === +req.params.id);
    if (video) {
        res.send(video);
    }
    else
        res.send(404);
});
exports.app.post("/videos", (req, res) => {
    const errorsMessages = [];
    if (!Array.isArray(req.body.availableResolutions) ||
        req.body.availableResolutions.length === 0 ||
        !req.body.availableResolutions.every(isValidResolution)) {
        errorsMessages.push({
            message: "availableResolutions field is incorrect",
            field: "availableResolutions",
        });
    }
    if (!req.body.author || req.body.author.length > 20) {
        errorsMessages.push({
            message: "Author field is incorrect",
            field: "author",
        });
    }
    if (!req.body.title || req.body.title.length > 40) {
        errorsMessages.push({
            message: "Title field is incorrect",
            field: "title",
        });
    }
    if (errorsMessages.length > 0) {
        res.status(400).send({ errorsMessages });
        return;
    }
    const createdAt = new Date();
    const publicationDate = new Date(createdAt);
    publicationDate.setDate(createdAt.getDate() + 1);
    const newVideo = {
        id: +new Date(),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: req.body.canBeDownloaded !== undefined ? req.body.canBeDownloaded : false, // Default value: false
        minAgeRestriction: req.body.minAgeRestriction !== undefined
            ? req.body.minAgeRestriction
            : null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions: req.body.availableResolutions,
    };
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
exports.app.put("/videos/:id", (req, res) => {
    let video = videos.find((p) => p.id === +req.params.id);
    const errorsMessages = [];
    if (!video) {
        res.sendStatus(404);
        return;
    }
    else {
        if (!req.body.title ||
            typeof req.body.title !== "string" ||
            req.body.title.length > 40) {
            errorsMessages.push({
                message: "Invalid title",
                field: "title",
            });
        }
        if (!req.body.author ||
            typeof req.body.author !== "string" ||
            req.body.author.length > 20) {
            errorsMessages.push({
                message: "Invalid author",
                field: "author",
            });
        }
        if (!Array.isArray(req.body.availableResolutions) ||
            req.body.availableResolutions.length === 0 ||
            !req.body.availableResolutions.every(isValidResolution)) {
            errorsMessages.push({
                message: "availableResolutions field is incorrect",
                field: "availableResolutions",
            });
        }
        // Проверка поля canBeDownloaded
        if (typeof req.body.canBeDownloaded !== "boolean") {
            errorsMessages.push({
                message: "Invalid canBeDownloaded",
                field: "canBeDownloaded",
            });
        }
        // Проверка поля minAgeRestriction
        if (typeof req.body.minAgeRestriction !== "number" ||
            req.body.minAgeRestriction < 0 ||
            req.body.minAgeRestriction > 18) {
            errorsMessages.push({
                message: "Invalid minAgeRestriction",
                field: "minAgeRestriction",
            });
        }
        // Проверка поля publicationDate
        if (typeof req.body.publicationDate !== "string" ||
            !Date.parse(req.body.publicationDate)) {
            errorsMessages.push({
                message: "Invalid publicationDate",
                field: "publicationDate",
            });
        }
        if (errorsMessages.length > 0) {
            res.status(400).send({ errorsMessages });
            return;
        }
    }
    (video.title = req.body.title),
        (video.author = req.body.author),
        (video.canBeDownloaded =
            req.body.canBeDownloaded !== undefined
                ? req.body.canBeDownloaded
                : false), // Default value: false
        (video.minAgeRestriction =
            req.body.minAgeRestriction !== undefined
                ? req.body.minAgeRestriction
                : null),
        (video.publicationDate = req.body.publicationDate),
        (video.availableResolutions = req.body.availableResolutions),
        res.sendStatus(204);
});
exports.app.delete("/videos/:id", (req, res) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1);
            res.sendStatus(204);
            return;
        }
    }
    res.send(404);
});
exports.app.delete("/testing/all-data", (req, res) => {
    videos = [];
    res.send(204);
});
