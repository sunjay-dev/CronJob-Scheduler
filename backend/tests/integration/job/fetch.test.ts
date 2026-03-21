import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "@/app.js";
import agenda from "@/config/agenda.config.js";
import * as jwtUtils from "@/utils/jwt.utils.js";
import mongoose from "mongoose";

vi.mock("@/utils/jwt.utils.js");
vi.mock("@/config/agenda.config.js");

describe("GET /api/v1/jobs", () => {
  it("should return 401 if unauthenticated", async () => {
    const response = await request(app).get("/api/v1/jobs");
    expect(response.status).toBe(401);
  });

  it("should fetch all jobs for a specific user successfully", async () => {
    const validUserId = "user-abc-123";
    vi.mocked(jwtUtils.verifyToken).mockReturnValue({ userId: validUserId } as any);

    const mockJobs = [{ name: "Job 1" }, { name: "Job 2" }];
    vi.mocked(agenda.jobs).mockResolvedValue(mockJobs as any);

    const response = await request(app).get("/api/v1/jobs").set("Authorization", "Bearer validsimulatedtoken");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockJobs);
    expect(agenda.jobs).toHaveBeenCalledWith({ "data.userId": validUserId });
  });
});

describe("GET /api/v1/jobs/:jobId", () => {
  it("should return 400 for invalid jobId parameter", async () => {
    vi.mocked(jwtUtils.verifyToken).mockReturnValue({ userId: "user-abc-123" } as any);

    const response = await request(app).get("/api/v1/jobs/invalid-id").set("Authorization", "Bearer validsimulatedtoken");

    expect(response.status).toBe(400);
    expect(response.body.message.length).toBeGreaterThan(0);
  });

  it("should return jobs matching ID and user", async () => {
    const validUserId = "user-abc-123";
    const validJobId = new mongoose.Types.ObjectId().toString();

    vi.mocked(jwtUtils.verifyToken).mockReturnValue({ userId: validUserId } as any);

    const mockJob = [{ name: "Specific Job" }];
    vi.mocked(agenda.jobs).mockResolvedValue(mockJob as any);

    const response = await request(app)
      .get(`/api/v1/jobs/${validJobId}`)
      .set("Authorization", "Bearer validsimulatedtoken");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockJob);
    expect(agenda.jobs).toHaveBeenCalledWith({
      "data.userId": validUserId,
      _id: expect.any(mongoose.Types.ObjectId),
    });
  });
});
