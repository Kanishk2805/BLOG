import { useEffect, useState } from "react";
import { http } from "../api/http.js";

function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      setError("");
      const [statsRes, usersRes, postsRes] = await Promise.all([
        http.get("/admin/stats"),
        http.get("/admin/users"),
        http.get("/admin/posts")
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users || []);
      setPosts(postsRes.data.posts || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load admin data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await http.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not delete user.");
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await http.delete(`/admin/posts/${id}`);
      setPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not delete post.");
    }
  };

  if (isLoading) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">Loading admin dashboard...</p>;
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          User management and content moderation controls.
        </p>
        {error && <p className="mt-3 text-sm text-rose-600 dark:text-rose-300">{error}</p>}
        {stats && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {Object.entries(stats).map(([key, value]) => (
              <div
                key={key}
                className="rounded-lg border border-slate-200 px-4 py-3 text-sm dark:border-slate-700"
              >
                <p className="text-xs uppercase tracking-wider text-slate-500">{key}</p>
                <p className="mt-1 text-xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Users</h3>
          <div className="mt-4 space-y-2">
            {users.slice(0, 15).map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700"
              >
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteUser(user._id)}
                  className="rounded-md border border-rose-300 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-950/40"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Posts</h3>
          <div className="mt-4 space-y-2">
            {posts.slice(0, 15).map((post) => (
              <div
                key={post._id}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700"
              >
                <div>
                  <p className="text-sm font-medium">{post.title}</p>
                  <p className="text-xs text-slate-500">by {post.author?.name || "Unknown"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeletePost(post._id)}
                  className="rounded-md border border-rose-300 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-950/40"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminPage;
