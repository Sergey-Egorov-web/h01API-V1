import request, { Response } from "supertest";
import { app } from "../src/settings";
import { response } from "express";

describe("/", () => {
  it("should return 200 and empty array", () => {
    expect(1).toBe(1);
  });
});

describe("/videos", () => {
  beforeAll(async () => {
    await request(app).delete("/testing/all-data");
  });
  it("should return 200 and empty array", async () => {
    await request(app).get("/videos").expect(200, []);
  });

  it("should create new video with correct input data", async () => {
    const response: Response = await request(app)
      .post("/videos")
      .send({
        title: "new title",
        author: "string",
        minAgeRestriction: "12",
        availableResolutions: ["P144"],
      })
      .expect(201);

    expect(response.body).toEqual({
      id: expect.any(Number),
      title: "new title",
      author: "string",
      canBeDownloaded: false,
      minAgeRestriction: "12",
      // createdAt: expect.any(String),
      createdAt: expect.stringMatching(
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
      ),
      publicationDate: expect.stringMatching(
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
      ),
      availableResolutions: ["P144"],
    });
  });
  it("shouldn't create new video with incorrect input data", async () => {
    const response: Response = await request(app)
      .post("/videos")
      .send({
        // title: "",
        author: "string",
        minAgeRestriction: "12",
        availableResolutions: ["P144"],
      })
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        {
          message: "Required fields are missing",
          field: "title, author, availableResolutions",
        },
      ],
    });
  });
});
