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
    }
});

export default mongoose.model.Post || mongoose.model('Post', PostSchema);