import mongoose from "mongoose";

const joblogsSchema = new mongoose.Schema({
    jobId: {
        type: String,
        required: true,
        index: true
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
        enum: ["success", "failed"],
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
    },
    responseTime: {
        DNS: Number,
        Connect: Number,
        SSL: Number,
        Send: Number,
        Wait: Number,
        Receive: Number,
        Total: Number
    },
}, {
    timestamps: true
});

joblogsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 31 * 3 });

export default mongoose.model("JobLog", joblogsSchema);