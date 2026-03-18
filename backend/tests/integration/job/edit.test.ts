import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "@/app.js";
import agenda from "@/config/agenda.config.js";
import * as jwtUtils from "@/utils/jwt.utils.js";
import mongoose from "mongoose";

vi.mock("@/utils/jwt.utils.js");
vi.mock("@/config/agenda.config.js");

describe("PUT /api/jobs/:jobId", () => {
  const validJobId = new mongoose.Types.ObjectId().toString();

  beforeEach(() => {
    vi.mocked(jwtUtils.verifyToken).mockReturnValue({ userId: "user-abc-123" } as any);
  });

  const validEditPayload = {
    name: "Updated Ping Service",
    url: "https://example.com/api",
    method: "POST",
    cron: "*/10 * * * * *",
    timezone: "UTC",
    enabled: false,
    timeout: 15,
    email: false,
    body: '{"status": "ok"}',
    headers: [],
  };

  it("should return 404 if job does not exist for the user", async () => {
    vi.mocked(agenda.jobs).mockResolvedValue([]);

    const response = await request(app)
      .put(`/api/jobs/${validJobId}`)
      .set("Authorization", "Bearer token")
      .send(validEditPayload);

    expect(response.status).toBe(404);
    expect(response.body.message.length).toBeGreaterThan(0);
  });

  it("should edit the job and return 200", async () => {
    const mockJob = {
      attrs: {
        data: {},
        repeatInterval: "old_cron",
        repeatTimezone: "old_tz",
      },
      computeNextRunAt: vi.fn(),
      disable: vi.fn(),
      enable: vi.fn(),
      save: vi.fn().mockResolvedValue(true),
    };

    vi.mocked(agenda.jobs).mockResolvedValue([mockJob] as any);

    const response = await request(app)
      .put(`/api/jobs/${validJobId}`)
      .set("Authorization", "Bearer token")
      .send(validEditPayload);

    expect(response.status).toBe(200);
    expect(response.body.message.length).toBeGreaterThan(0);
    expect(mockJob.attrs.repeatInterval).toBe("*/10 * * * * *");
    expect(mockJob.attrs.repeatTimezone).toBe("UTC");
    expect(mockJob.disable).toHaveBeenCalled();
    expect(mockJob.save).toHaveBeenCalled();
  });
});
