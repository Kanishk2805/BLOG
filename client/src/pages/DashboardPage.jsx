import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import { useMemo } from "react";

function DashboardPage() {
  const { user } = useAuth();
  const recentlyViewed = useMemo(
    () => JSON.parse(localStorage.getItem("screenscope_recently_viewed") || "[]"),
    []
  );

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold tracking-tight">Welcome back, {user?.name}</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Manage your reviews and publish new content from here.
        </p>
        <div className="mt-4 flex gap-3">
          <Link
            to="/posts/new"
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Create Review
          </Link>
          <Link
            to="/my-posts"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Manage My Posts
          </Link>
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="rounded-md border border-brand-300 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-950/40"
            >
              Open Admin Panel
            </Link>
          )}
        </div>
      </div>
      {/* ...Session active component removed... */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-semibold tracking-tight">Activity History</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Recently viewed posts from this browser session.
        </p>
        <div className="mt-4 space-y-2">
          {recentlyViewed.slice(0, 5).map((post) => (
            <Link
              key={post._id}
              to={`/posts/${post._id}`}
              className="block rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <p className="font-medium">{post.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{post.type}</p>
            </Link>
          ))}
          {recentlyViewed.length === 0 && (
            <p className="text-sm text-slate-600 dark:text-slate-300">No activity yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
