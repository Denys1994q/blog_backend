import mongoose, { Schema } from "mongoose";

// всі властивості, які можути бути в допису
const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
            unique: true,
        },
        tags: {
            type: Array,
            default: [],
        },
        ingredients: {
            type: Array,
            default: [],
        },
        energy: [],
        cookTime: {
            type: Number,
            default: 0,
        },
        viewsCount: {
            type: Number,
            default: 0,
        },
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        imageUrl: String,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Post", PostSchema);
