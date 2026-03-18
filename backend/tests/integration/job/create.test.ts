import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "@/app.js";
import agenda from "@/config/agenda.config.js";
import * as jwtUtils from "@/utils/jwt.utils.js";

vi.mock("@/utils/jwt.utils.js");
vi.mock("@/config/agenda.config.js");

describe("POST /api/jobs", () => {
  beforeEach(() => {
    vi.mocked(jwtUtils.verifyToken).mockReturnValue({ userId: "user-abc-123" } as any);
  });

  const validPayload = {
    name: "Ping Service",
    url: "https://example.com/api",
    method: "GET",
    cron: "*/5 * * * * *",
    timezone: "UTC",
    enabled: true,
    timeout: 10,
    email: false,
    body: "",
    headers: [],
  };

  it("should return 400 for missing or invalid data", async () => {
    const response = await request(app)
      .post("/api/jobs")
      .set("Authorization", "Bearer token")
      .send({ ...validPayload, method: "INVALID" });

    expect(response.status).toBe(400);
    expect(response.body.message.length).toBeGreaterThan(0);
  });

  it("should return 400 if method does not allow body", async () => {
    const response = await request(app)
      .post("/api/jobs")
      .set("Authorization", "Bearer token")
      .send({ ...validPayload, method: "GET", body: '{"key": "value"}' });

    expect(response.status).toBe(400);
    expect(response.body.message.length).toBeGreaterThan(0);
  });

  it("should create job successfully and return 200", async () => {
    const mockJob = {
      repeatEvery: vi.fn(),
      save: vi.fn().mockResolvedValue(true),
      attrs: { disabled: false },
    };

    vi.mocked(agenda.create).mockReturnValue(mockJob as any);

    const response = await request(app).post("/api/jobs").set("Authorization", "Bearer token").send(validPayload);

    expect(response.status).toBe(200);
    expect(response.body.message.length).toBeGreaterThan(0);
    expect(agenda.create).toHaveBeenCalledWith("http-request", expect.objectContaining({ name: "Ping Service" }));
    expect(mockJob.repeatEvery).toHaveBeenCalledWith("*/5 * * * * *", { timezone: "UTC", skipImmediate: true });
    expect(mockJob.save).toHaveBeenCalled();
  });
});
