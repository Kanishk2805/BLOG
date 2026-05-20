import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { http } from "../api/http.js";

function MyPostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyPosts = async () => {
    try {
      setIsLoading(true);
      setError("");
      const { data } = await http.get(`/posts?author=${user.id}&limit=50`);
      setPosts(data.posts || []);
    } catch (_error) {
      setError("Could not load your posts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchMyPosts();
    }
  }, [user?.id]);

  const handleDelete = async (postId) => {
    try {
      await http.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (_error) {
      setError("Could not delete this post.");
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">My Reviews</h2>
        <Link
          to="/posts/new"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          New Review
        </Link>
      </div>

      {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}
      {isLoading && <p className="text-sm text-slate-600 dark:text-slate-300">Loading your posts...</p>}

      {!isLoading && posts.length === 0 && (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          You have not created any reviews yet.
        </p>
      )}

      <div className="space-y-3">
        {posts.map((post) => (
          <article
            key={post._id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{post.description}</p>
            <div className="mt-3 flex gap-2">
              <Link
                to={`/posts/${post._id}/edit`}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(post._id)}
                className="rounded-md border border-rose-300 px-3 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-950/40"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default MyPostsPage;
