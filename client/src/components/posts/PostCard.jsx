import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { http } from "../../api/http.js";
import { getPostImage } from "../../utils/postVisuals.js";

function PostCard({ post }) {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(Boolean(post.viewerHasLiked));
  const [bookmarked, setBookmarked] = useState(Boolean(post.viewerHasBookmarked));
  const [likesCount, setLikesCount] = useState(Number(post.likesCount || 0));
  const [bookmarksCount, setBookmarksCount] = useState(Number(post.bookmarksCount || 0));

  useEffect(() => {
    setLiked(Boolean(post.viewerHasLiked));
    setBookmarked(Boolean(post.viewerHasBookmarked));
    setLikesCount(Number(post.likesCount || 0));
    setBookmarksCount(Number(post.bookmarksCount || 0));
  }, [post.viewerHasLiked, post.viewerHasBookmarked, post.likesCount, post.bookmarksCount]);

  const toggleLike = async () => {
    if (!isAuthenticated) return;
    const { data } = await http.post("/interactions/like", { postId: post._id });
    setLiked(Boolean(data.liked));
    setLikesCount(Number(data.likesCount || 0));
  };

  const toggleBookmark = async () => {
    if (!isAuthenticated) return;
    const { data } = await http.post("/interactions/bookmark", { postId: post._id });
    setBookmarked(Boolean(data.bookmarked));
    setBookmarksCount(Number(data.bookmarksCount || 0));
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <img
        src={getPostImage(post)}
        alt={post.title}
        className="h-44 w-full object-cover"
        onError={(event) => {
          event.currentTarget.src =
            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80";
        }}
      />
      <div className="p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {post.type}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {post.averageRating?.toFixed?.(1) || Number(post.averageRating || 0).toFixed(1)} / 5
        </span>
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{post.title}</h3>
      <p className="mt-2 max-h-16 overflow-hidden text-sm text-slate-600 dark:text-slate-300">
        {post.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(post.tags || []).slice(0, 3).map((tag) => (
          <span
            key={`${post._id}-${tag}`}
            className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300"
          >
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-slate-500 dark:text-slate-400">by {post.author?.name || "Unknown"}</p>
        <Link
          to={`/posts/${post._id}`}
          className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300"
        >
          View
        </Link>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={!isAuthenticated}
          onClick={toggleLike}
          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200"
        >
          {liked ? "Liked" : "Like"} ({likesCount})
        </button>
        <button
          type="button"
          disabled={!isAuthenticated}
          onClick={toggleBookmark}
          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200"
        >
          {bookmarked ? "Saved" : "Save"} ({bookmarksCount})
        </button>
      </div>
      </div>
    </article>
  );
}

export default PostCard;
