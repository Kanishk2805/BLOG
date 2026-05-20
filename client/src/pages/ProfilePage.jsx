import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { http } from "../api/http.js";

function ProfilePage() {
  const { user } = useAuth();
  const [myPosts, setMyPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) {
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const { data } = await http.get(`/posts?author=${user.id}&limit=50`);
        setMyPosts(data.posts || []);
      } catch (_error) {
        setError("Could not load profile activity.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.id]);

  const averageRatingGiven = useMemo(() => {
    if (!myPosts.length) {
      return "0.0";
    }

    const total = myPosts.reduce((sum, post) => sum + Number(post.averageRating || 0), 0);
    return (total / myPosts.length).toFixed(1);
  }, [myPosts]);

  const downloadProfilePdf = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const createdAt = new Date().toLocaleString();
    const lines = [
      "ScreenScope Profile Snapshot",
      `Generated: ${createdAt}`,
      "",
      `Name: ${user?.name || "-"}`,
      `Email: ${user?.email || "-"}`,
      `Role: ${user?.role || "user"}`,
      "",
      `Total Posts: ${myPosts.length}`,
      `Avg Post Rating: ${averageRatingGiven}`,
      "",
      "Recent Posts:"
    ];

    myPosts.slice(0, 10).forEach((post, index) => {
      lines.push(
        `${index + 1}. ${post.title} (${post.type}) - ${Number(post.averageRating || 0).toFixed(1)}/5`
      );
    });

    doc.setFontSize(12);
    doc.text(lines, 14, 18);
    doc.save("screenscope-profile.pdf");
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">My Profile</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Personal account details and publishing summary.
            </p>
          </div>
          <button
            type="button"
            onClick={downloadProfilePdf}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Download PDF
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-xs uppercase tracking-wider text-slate-500">Name</p>
            <p className="mt-1 font-semibold">{user?.name}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-xs uppercase tracking-wider text-slate-500">Posts</p>
            <p className="mt-1 font-semibold">{myPosts.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-xs uppercase tracking-wider text-slate-500">Avg Rating</p>
            <p className="mt-1 font-semibold">{averageRatingGiven} / 5</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-semibold tracking-tight">My Recent Posts</h3>
        {isLoading && <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Loading posts...</p>}
        {error && <p className="mt-3 text-sm text-rose-600 dark:text-rose-300">{error}</p>}
        {!isLoading && !error && myPosts.length === 0 && (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            No posts yet. Create your first review to populate your profile.
          </p>
        )}
        <div className="mt-4 space-y-2">
          {myPosts.slice(0, 8).map((post) => (
            <div
              key={post._id}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
            >
              <span className="font-medium">{post.title}</span>
              <span className="text-slate-500 dark:text-slate-400">
                {" "}
                • {post.type} • {Number(post.averageRating || 0).toFixed(1)}/5
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
