import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        content: { type: String, required: true },
        // likes: { type: Number, default: 0 },
        // dislikes: { type: Number, default: 0 },
        // votes: { type: mongoose.Schema.Types.ObjectId, ref: "Vote" },
        votes: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                result: { type: String, required: true },
            },
        ],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
