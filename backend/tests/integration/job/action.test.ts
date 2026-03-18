import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "@/app.js";
import agenda from "@/config/agenda.config.js";
import logsModels from "@/models/logs.models.js";
import * as jwtUtils from "@/utils/jwt.utils.js";
import mongoose from "mongoose";

vi.mock("@/utils/jwt.utils.js");
vi.mock("@/config/agenda.config.js");
vi.mock("@/models/logs.models.js");

describe("Job Mutating Actions", () => {
  const validJobId = new mongoose.Types.ObjectId().toString();

  beforeEach(() => {
    vi.mocked(jwtUtils.verifyToken).mockReturnValue({ userId: "user-abc-123" } as any);
  });

  describe("PUT /api/jobs/status", () => {
    it("should toggle the status successfully", async () => {
      const mockJob = {
        enable: vi.fn(),
        disable: vi.fn(),
        attrs: { data: { errorCount: 5 } },
        save: vi.fn().mockResolvedValue(true),
      };

      vi.mocked(agenda.jobs).mockResolvedValue([mockJob] as any);

      const response = await request(app)
        .put("/api/jobs/status")
        .set("Authorization", "Bearer token")
        .send({ jobId: validJobId, status: true });

      expect(response.status).toBe(200);
      expect(response.body.message.length).toBeGreaterThan(0);
      expect(mockJob.enable).toHaveBeenCalled();
      expect(mockJob.attrs.data.errorCount).toBe(0);
    });

    it("should return 404 if no job found for status update", async () => {
      vi.mocked(agenda.jobs).mockResolvedValue([]);

      const response = await request(app)
        .put("/api/jobs/status")
        .set("Authorization", "Bearer token")
        .send({ jobId: validJobId, status: false });

      expect(response.status).toBe(404);
      expect(response.body.message.length).toBeGreaterThan(0);
    });
  });

  describe("POST /api/jobs/trigger", () => {
    it("should trigger job execution immediately", async () => {
      const mockJob = { attrs: { name: "http-request", data: { url: "example.com" }, _id: validJobId } };
      vi.mocked(agenda.jobs).mockResolvedValue([mockJob] as any);

      const response = await request(app)
        .post("/api/jobs/trigger")
        .set("Authorization", "Bearer token")
        .send({ jobId: validJobId });

      expect(response.status).toBe(200);
      expect(response.body.message.length).toBeGreaterThan(0);
      expect(agenda.now).toHaveBeenCalledWith(
        "http-request",
        expect.objectContaining({ url: "example.com", jobId: validJobId }),
      );
    });
  });

  describe("DELETE /api/jobs/:jobId", () => {
    it("should return 404 if agenda cannot delete job", async () => {
      vi.mocked(agenda.cancel).mockResolvedValue(0);

      const response = await request(app).delete(`/api/jobs/${validJobId}`).set("Authorization", "Bearer token");

      expect(response.status).toBe(404);
      expect(response.body.message.length).toBeGreaterThan(0);
    });

    it("should delete job and its associated logs successfully", async () => {
      vi.mocked(agenda.cancel).mockResolvedValue(1);
      vi.mocked(logsModels.deleteMany).mockResolvedValue(true as any);

      const response = await request(app).delete(`/api/jobs/${validJobId}`).set("Authorization", "Bearer token");

      expect(response.status).toBe(200);
      expect(response.body.message.length).toBeGreaterThan(0);
      expect(logsModels.deleteMany).toHaveBeenCalledWith({ jobId: validJobId });
    });
  });
});
