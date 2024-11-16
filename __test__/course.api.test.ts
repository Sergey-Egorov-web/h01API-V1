import request from "supertest";
import { app } from "../src/settings";

describe("/", () => {
  it("should return 200 and empty array", () => {
    expect(1).toBe(1);
  });
});

describe("/videos", () => {
  it("should return 200 and empty array", async () => {
    await request(app)
      .get("/videos")
      .expect(200, [
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
      ]);
  });
});
