import Bookmark from "../models/Bookmark.js";
import Like from "../models/Like.js";
import Post from "../models/Post.js";

const ensurePost = async (postId) => {
  const post = await Post.findById(postId);
  return post;
};

export const toggleLike = async (req, res, next) => {
  try {
    const { postId } = req.body;
    if (!postId) {
      return res.status(400).json({ message: "postId is required" });
    }

    const post = await ensurePost(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existing = await Like.findOne({ user: req.user.id, post: postId });
    let liked;

    if (existing) {
      await existing.deleteOne();
      post.likesCount = Math.max(0, Number(post.likesCount || 0) - 1);
      liked = false;
    } else {
      await Like.create({ user: req.user.id, post: postId });
      post.likesCount = Number(post.likesCount || 0) + 1;
      liked = true;
    }

    await post.save();
    return res.status(200).json({ liked, likesCount: post.likesCount });
  } catch (error) {
    return next(error);
  }
};

export const toggleBookmark = async (req, res, next) => {
  try {
    const { postId } = req.body;
    if (!postId) {
      return res.status(400).json({ message: "postId is required" });
    }

    const post = await ensurePost(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existing = await Bookmark.findOne({ user: req.user.id, post: postId });
    let bookmarked;

    if (existing) {
      await existing.deleteOne();
      post.bookmarksCount = Math.max(0, Number(post.bookmarksCount || 0) - 1);
      bookmarked = false;
    } else {
      await Bookmark.create({ user: req.user.id, post: postId });
      post.bookmarksCount = Number(post.bookmarksCount || 0) + 1;
      bookmarked = true;
    }

    await post.save();
    return res.status(200).json({ bookmarked, bookmarksCount: post.bookmarksCount });
  } catch (error) {
    return next(error);
  }
};

export const getMyBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id })
      .populate({
        path: "post",
        populate: { path: "author", select: "name email avatarUrl" }
      })
      .sort({ createdAt: -1 });

    const posts = bookmarks.map((item) => item.post).filter(Boolean);
    return res.status(200).json({ posts });
  } catch (error) {
    return next(error);
  }
};
