import mongoose from "mongoose";

const joblogsSchema = new mongoose.Schema({
    jobId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    status: {
        type: String,
        required: true,
        enum: ["success", "error"],
        index: true
    },
    method: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    statusCode: {
        type: String
    },
    response: {
        type: String,
        required: false
    }
}, {
    timestamps: true
})
joblogsSchema.index({ userId: 1, createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });
export default mongoose.model("JobLog", joblogsSchema);