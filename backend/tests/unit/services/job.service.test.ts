import { describe, it, expect, vi } from "vitest";
import * as jobService from "@/services/job.service.js";
import agenda from "@/config/agenda.config.js";
import logsModels from "@/models/logs.models.js";
import mongoose from "mongoose";
import { NotFoundError } from "@/utils/appError.utils.js";
import mockingoose from "mockingoose";

vi.mock("@/config/agenda.config.js");

describe("Job Service", () => {
  const validUserId = "507f1f77bcf86cd799439011";
  const validJobId = "507f1f77bcf86cd799439012";

  let mockJob: any;

  mockJob = {
    attrs: {
      _id: new mongoose.Types.ObjectId(validJobId),
      name: "http-request",
      data: { url: "test.com", userId: validUserId },
      repeatInterval: "",
      repeatTimezone: "",
      disabled: true,
    },
    computeNextRunAt: vi.fn(),
    enable: vi.fn(),
    disable: vi.fn(),
    save: vi.fn().mockResolvedValue(true),
    repeatEvery: vi.fn(),
  };

  describe("createJobAction", () => {
    it("should create and save a job", async () => {
      const jobData = { name: "test-job" };
      vi.mocked(agenda.create).mockReturnValue(mockJob);

      const result = await jobService.createJobAction(jobData as any, "*/5 * * * *", "UTC", true);

      expect(agenda.create).toHaveBeenCalledWith("http-request", jobData);
      expect(mockJob.repeatEvery).toHaveBeenCalledWith("*/5 * * * *", { timezone: "UTC", skipImmediate: true });
      expect(mockJob.save).toHaveBeenCalled();
      expect(result).toBe(mockJob);
    });

    it("should set disabled true if enabled is false", async () => {
      vi.mocked(agenda.create).mockReturnValue(mockJob);
      await jobService.createJobAction({} as any, "*/5 * * * *", "UTC", false);

      expect(mockJob.attrs.disabled).toBe(true);
    });
  });

  describe("editJobAction", () => {
    it("should throw NotFoundError if job is not found", async () => {
      vi.mocked(agenda.jobs).mockResolvedValue([]);

      await expect(
        jobService.editJobAction(validJobId, validUserId, {} as any, "*/5 * * * *", "UTC", true),
      ).rejects.toThrow(NotFoundError);
    });

    it("should update and save an existing job", async () => {
      vi.mocked(agenda.jobs).mockResolvedValue([mockJob]);

      const updateData = { name: "updated-job", userId: validUserId };
      const result = await jobService.editJobAction(
        validJobId,
        validUserId,
        updateData as any,
        "*/10 * * * *",
        "UTC",
        true,
      );

      expect(mockJob.attrs.data).toEqual(
        expect.objectContaining({
          ...updateData,
          errorCount: 0,
          userId: validUserId,
        }),
      );
      expect(mockJob.attrs.repeatInterval).toBe("*/10 * * * *");
      expect(mockJob.attrs.repeatTimezone).toBe("UTC");
      expect(mockJob.computeNextRunAt).toHaveBeenCalled();
      expect(mockJob.enable).toHaveBeenCalled();
      expect(mockJob.save).toHaveBeenCalled();
      expect(result).toBe(mockJob);
    });
  });

  describe("fetchUserJobs", () => {
    it("should fetch jobs for a user", async () => {
      const mockJobs = [{ id: "1" }];
      vi.mocked(agenda.jobs).mockResolvedValue(mockJobs as any);

      const result = await jobService.fetchUserJobs("user-1");

      expect(agenda.jobs).toHaveBeenCalledWith({ "data.userId": "user-1" });
      expect(result).toBe(mockJobs);
    });
  });

  describe("deleteJobAction", () => {
    it("should throw NotFoundError if cancel returns 0", async () => {
      vi.mocked(agenda.cancel).mockResolvedValue(0);

      await expect(jobService.deleteJobAction(validJobId, validUserId)).rejects.toThrow(NotFoundError);
    });

    it("should cancel job and delete associated logs", async () => {
      vi.mocked(agenda.cancel).mockResolvedValue(1);
      mockingoose(logsModels).toReturn({ deletedCount: 1 }, "deleteMany");

      const result = await jobService.deleteJobAction(validJobId, validUserId);

      expect(agenda.cancel).toHaveBeenCalled();
      expect(result).toBe(1);
    });
  });

  describe("executeJobNow", () => {
    it("should throw NotFoundError if job is not found", async () => {
      vi.mocked(agenda.jobs).mockResolvedValue([]);

      await expect(jobService.executeJobNow(validJobId, validUserId)).rejects.toThrow(NotFoundError);
    });

    it("should trigger job execution immediately", async () => {
      vi.mocked(agenda.jobs).mockResolvedValue([mockJob]);
      vi.mocked(agenda.now).mockResolvedValue({} as any);

      const result = await jobService.executeJobNow(validJobId, validUserId);

      expect(agenda.now).toHaveBeenCalledWith(
        "http-request",
        expect.objectContaining({
          url: "test.com",
          userId: validUserId,
          jobId: validJobId,
        }),
      );
      expect(result).toBe(mockJob);
    });
  });
});
