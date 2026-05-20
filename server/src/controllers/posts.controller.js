import mongoose from "mongoose";
import Post from "../models/Post.js";
import Like from "../models/Like.js";
import Bookmark from "../models/Bookmark.js";

const sanitizeTags = (tags) => {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .map((tag) => String(tag).trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 12);
};

export const getPosts = async (req, res, next) => {
  try {
    const { q, type, genre, minRating, tag, author, page = 1, limit = 12 } = req.query;
    const query = {};

    if (q) {
      query.$text = { $search: String(q).trim() };
    }
    if (type) {
      query.type = String(type).toLowerCase();
    }
    if (genre) {
      query.genre = String(genre).toLowerCase();
    }
    if (tag) {
      query.tags = { $in: [String(tag).toLowerCase()] };
    }
    if (minRating) {
      query.averageRating = { $gte: Number(minRating) || 0 };
    }
    if (author) {
      query.author = author;
    }

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageLimit = Math.min(50, Math.max(1, Number(limit) || 12));

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate("author", "name email avatarUrl")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageLimit)
        .limit(pageLimit),
      Post.countDocuments(query)
    ]);

    let enrichedPosts = posts;
    if (req.user?.id && posts.length > 0) {
      const postIds = posts.map((post) => post._id);
      const [likes, bookmarks] = await Promise.all([
        Like.find({ user: req.user.id, post: { $in: postIds } }).select("post"),
        Bookmark.find({ user: req.user.id, post: { $in: postIds } }).select("post")
      ]);
      const likedPostIds = new Set(likes.map((entry) => String(entry.post)));
      const bookmarkedPostIds = new Set(bookmarks.map((entry) => String(entry.post)));
      enrichedPosts = posts.map((post) => ({
        ...post.toObject(),
        viewerHasLiked: likedPostIds.has(String(post._id)),
        viewerHasBookmarked: bookmarkedPostIds.has(String(post._id))
      }));
    }

    res.status(200).json({
      posts: enrichedPosts,
      pagination: {
        page: pageNumber,
        limit: pageLimit,
        total,
        totalPages: Math.ceil(total / pageLimit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name email avatarUrl");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ post });
  } catch (error) {
    return next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, description, content = "", type, genre = "general", tags = [], imageUrl = "" } = req.body;

    if (!title || !description || !type) {
      return res.status(400).json({ message: "Title, description, and type are required" });
    }

    const post = await Post.create({
      title: String(title).trim(),
      description: String(description).trim(),
      content: String(content).trim(),
      type: String(type).toLowerCase(),
      genre: String(genre).trim().toLowerCase(),
      tags: sanitizeTags(tags),
      imageUrl: String(imageUrl).trim(),
      author: req.user.id
    });

    const populated = await Post.findById(post._id).populate("author", "name email avatarUrl");
    return res.status(201).json({ message: "Post created", post: populated });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    return next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isOwnerOrAdmin = post.author.toString() === req.user.id || req.user.role === "admin";
    if (!isOwnerOrAdmin) {
      return res.status(403).json({ message: "Forbidden: cannot edit this post" });
    }

    const { title, description, content, type, genre, tags, imageUrl } = req.body;
    if (title !== undefined) post.title = String(title).trim();
    if (description !== undefined) post.description = String(description).trim();
    if (content !== undefined) post.content = String(content).trim();
    if (type !== undefined) post.type = String(type).toLowerCase();
    if (genre !== undefined) post.genre = String(genre).trim().toLowerCase();
    if (imageUrl !== undefined) post.imageUrl = String(imageUrl).trim();
    if (tags !== undefined) post.tags = sanitizeTags(tags);

    await post.save();
    const populated = await Post.findById(post._id).populate("author", "name email avatarUrl");
    return res.status(200).json({ message: "Post updated", post: populated });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    return next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isOwnerOrAdmin = post.author.toString() === req.user.id || req.user.role === "admin";
    if (!isOwnerOrAdmin) {
      return res.status(403).json({ message: "Forbidden: cannot delete this post" });
    }

    await post.deleteOne();
    return res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    return next(error);
  }
};
