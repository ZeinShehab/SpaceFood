import mongoose from "mongoose";

export const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please insert title"]
    },
    photo: {
        type: String,
        required: [true, "Please insert a picture"]
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: { 
        type: Date, default: Date.now 
    },
    tags: {
        type: [String]
    },
    description: {
        type: String
    },
    rating: {
        type: Number
    },
    ratings: {
        type: [Number]
    },
    comments: {
        type: [String]
    }
});

export default mongoose.model.Post || mongoose.model('Post', PostSchema);