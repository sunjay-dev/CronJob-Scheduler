import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("Server basic routes", () => {
  it("should return 200 on GET /", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  });

  it("should return 200 on GET /health", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
  });
});
