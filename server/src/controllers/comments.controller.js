import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ post: postId })
      .populate("user", "name avatarUrl")
      .sort({ createdAt: -1 });

    return res.status(200).json({ comments });
  } catch (error) {
    return next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { postId, content } = req.body;
    if (!postId || !content?.trim()) {
      return res.status(400).json({ message: "postId and content are required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      post: postId,
      user: req.user.id,
      content: String(content).trim()
    });

    const populated = await Comment.findById(comment._id).populate("user", "name avatarUrl");
    return res.status(201).json({ message: "Comment created", comment: populated });
  } catch (error) {
    return next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isOwnerOrAdmin = comment.user.toString() === req.user.id || req.user.role === "admin";
    if (!isOwnerOrAdmin) {
      return res.status(403).json({ message: "Forbidden: cannot delete this comment" });
    }

    await comment.deleteOne();
    return res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    return next(error);
  }
};
