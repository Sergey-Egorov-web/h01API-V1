import request from "supertest";
import { app } from "../src/settings";

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
});
