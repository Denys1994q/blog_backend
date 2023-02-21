import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
);

export default mongoose.model("Vote", voteSchema);
