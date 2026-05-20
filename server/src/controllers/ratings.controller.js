import mongoose from "mongoose";
import Post from "../models/Post.js";
import Rating from "../models/Rating.js";

const recalculatePostRating = async (postId) => {
  const [aggregate] = await Rating.aggregate([
    { $match: { post: new mongoose.Types.ObjectId(postId) } },
    {
      $group: {
        _id: "$post",
        averageRating: { $avg: "$value" },
        ratingsCount: { $sum: 1 }
      }
    }
  ]);

  const averageRating = aggregate ? Number(aggregate.averageRating.toFixed(2)) : 0;
  const ratingsCount = aggregate ? aggregate.ratingsCount : 0;

  await Post.findByIdAndUpdate(postId, { averageRating, ratingsCount });
  return { averageRating, ratingsCount };
};

export const createOrUpdateRating = async (req, res, next) => {
  try {
    const { postId, value } = req.body;

    if (!postId || !value) {
      return res.status(400).json({ message: "postId and value are required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue < 1 || numericValue > 5) {
      return res.status(400).json({ message: "Rating value must be between 1 and 5" });
    }

    const rating = await Rating.findOneAndUpdate(
      { post: postId, user: req.user.id },
      { value: numericValue },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    const summary = await recalculatePostRating(postId);

    return res.status(200).json({
      message: "Rating saved",
      rating,
      summary
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    return next(error);
  }
};

export const getPostRatings = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const [summary] = await Rating.aggregate([
      { $match: { post: new mongoose.Types.ObjectId(postId) } },
      {
        $group: {
          _id: "$post",
          averageRating: { $avg: "$value" },
          ratingsCount: { $sum: 1 }
        }
      }
    ]);

    const userRatings = await Rating.find({ post: postId })
      .populate("user", "name avatarUrl")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      summary: {
        averageRating: summary ? Number(summary.averageRating.toFixed(2)) : 0,
        ratingsCount: summary ? summary.ratingsCount : 0
      },
      ratings: userRatings
    });
  } catch (error) {
    return next(error);
  }
};
