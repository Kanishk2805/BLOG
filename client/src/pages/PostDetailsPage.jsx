import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { http } from "../api/http.js";
import { useAuth } from "../context/AuthContext.jsx";
import { getPostImage } from "../utils/postVisuals.js";

function PostDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [post, setPost] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [ratingSummary, setRatingSummary] = useState({ averageRating: 0, ratingsCount: 0 });
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [selectedRating, setSelectedRating] = useState(5);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const myRating = useMemo(
    () => ratings.find((entry) => entry.user?._id === user?.id)?.value || null,
    [ratings, user?.id]
  );

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError("");
      const [postRes, ratingRes, commentsRes] = await Promise.all([
        http.get(`/posts/${id}`),
        http.get(`/ratings/${id}`),
        http.get(`/comments/${id}`)
      ]);
      setPost(postRes.data.post);
      setRatings(ratingRes.data.ratings || []);
      setRatingSummary(ratingRes.data.summary || { averageRating: 0, ratingsCount: 0 });
      setComments(commentsRes.data.comments || []);
    } catch (_error) {
      setError("Could not load this post.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    const storageKey = "screenscope_recently_viewed";
    if (!post?._id) return;
    const recent = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const next = [post, ...recent.filter((entry) => entry._id !== post._id)].slice(0, 8);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }, [post]);

  const submitRating = async () => {
    if (!isAuthenticated) return;
    await http.post("/ratings", { postId: id, value: selectedRating });
    await loadData();
  };

  const submitComment = async () => {
    if (!isAuthenticated || !commentText.trim()) return;
    await http.post("/comments", { postId: id, content: commentText.trim() });
    setCommentText("");
    await loadData();
  };

  const deleteComment = async (commentId) => {
    await http.delete(`/comments/${commentId}`);
    setComments((prev) => prev.filter((entry) => entry._id !== commentId));
  };

  if (isLoading) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">Loading post...</p>;
  }

  if (error || !post) {
    return <p className="text-sm text-rose-600 dark:text-rose-300">{error || "Post not found."}</p>;
  }

  return (
    <section className="space-y-6">
      <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <img src={getPostImage(post)} alt={post.title} className="h-64 w-full object-cover md:h-80" />
        <div className="p-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {post.type}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{post.genre}</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{post.description}</p>
          {post.content && (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {post.content}
            </p>
          )}
          <div className="mt-4 flex items-center gap-4 text-sm">
            <span>
              Rating: <strong>{Number(ratingSummary.averageRating || 0).toFixed(1)}</strong> / 5
            </span>
            <span>{ratingSummary.ratingsCount} votes</span>
            {myRating && <span>Your rating: {myRating}</span>}
          </div>
        </div>
      </article>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold">Rate This Post</h2>
          {!isAuthenticated ? (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Login to submit a rating.</p>
          ) : (
            <div className="mt-3 flex items-center gap-3">
              <select
                value={selectedRating}
                onChange={(event) => setSelectedRating(Number(event.target.value))}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} Stars
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={submitRating}
                className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Submit Rating
              </button>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold">Comments ({comments.length})</h2>
          {isAuthenticated && (
            <div className="mt-3 space-y-2">
              <textarea
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
              <button
                type="button"
                onClick={submitComment}
                className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Add Comment
              </button>
            </div>
          )}
          <div className="mt-4 space-y-3">
            {comments.map((comment) => (
              <article
                key={comment._id}
                className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{comment.user?.name || "User"}</p>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{comment.content}</p>
                  </div>
                  {(user?.id === comment.user?._id || user?.role === "admin") && (
                    <button
                      type="button"
                      onClick={() => deleteComment(comment._id)}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

export default PostDetailsPage;
