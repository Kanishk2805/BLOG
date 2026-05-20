import User from "../models/User.js";

const sanitizeUser = (userDoc) => ({
  id: userDoc._id,
  name: userDoc.name,
  email: userDoc.email,
  role: userDoc.role,
  avatarUrl: userDoc.avatarUrl,
  createdAt: userDoc.createdAt
});

export const getUsers = async (_req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ users: users.map(sanitizeUser) });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const canDelete = req.user.role === "admin" || req.user.id === targetUserId;

    if (!canDelete) {
      return res.status(403).json({ message: "Forbidden: cannot delete this user" });
    }

    const deleted = await User.findByIdAndDelete(targetUserId);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
