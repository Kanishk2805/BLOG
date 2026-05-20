import User from "../models/User.js";
import Post from "../models/Post.js";
import Rating from "../models/Rating.js";
import Comment from "../models/Comment.js";
import Bookmark from "../models/Bookmark.js";

export const getAdminStats = async (_req, res, next) => {
  try {
    const [users, posts, ratings, comments, bookmarks] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Rating.countDocuments(),
      Comment.countDocuments(),
      Bookmark.countDocuments()
    ]);

    return res.status(200).json({
      stats: { users, posts, ratings, comments, bookmarks }
    });
  } catch (error) {
    return next(error);
  }
};

export const getAdminUsers = async (_req, res, next) => {
  try {
    const users = await User.find()
      .select("name email role avatarUrl createdAt")
      .sort({ createdAt: -1 });
    return res.status(200).json({ users });
  } catch (error) {
    return next(error);
  }
};

export const getAdminPosts = async (_req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email role")
      .sort({ createdAt: -1 })
      .limit(100);
    return res.status(200).json({ posts });
  } catch (error) {
    return next(error);
  }
};

export const deleteAdminUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.id === id) {
      return res.status(400).json({ message: "Admin cannot delete own account here" });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return next(error);
  }
};

export const deleteAdminPost = async (req, res, next) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    return next(error);
  }
};
