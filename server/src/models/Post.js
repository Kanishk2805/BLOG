import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    content: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      enum: ["movie", "show", "anime"],
      required: true
    },
    genre: {
      type: String,
      trim: true,
      default: "general"
    },
    tags: {
      type: [String],
      default: []
    },
    imageUrl: {
      type: String,
      default: ""
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    averageRating: {
      type: Number,
      default: 0
    },
    ratingsCount: {
      type: Number,
      default: 0
    },
    likesCount: {
      type: Number,
      default: 0
    },
    bookmarksCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ type: 1, genre: 1 });
postSchema.index({ title: "text", description: "text", tags: "text" });

const Post = mongoose.model("Post", postSchema);

export default Post;
