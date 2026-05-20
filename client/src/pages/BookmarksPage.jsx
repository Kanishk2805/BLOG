import { useEffect, useState } from "react";
import PostCard from "../components/posts/PostCard.jsx";
import { http } from "../api/http.js";

function BookmarksPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setIsLoading(true);
        const { data } = await http.get("/interactions/bookmarks");
        setPosts(data.posts || []);
        setError("");
      } catch (_error) {
        setError("Could not load bookmarks.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-semibold tracking-tight">Saved Posts</h2>
      {isLoading && <p className="text-sm text-slate-600 dark:text-slate-300">Loading bookmarks...</p>}
      {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}
      {!isLoading && !error && posts.length === 0 && (
        <p className="text-sm text-slate-600 dark:text-slate-300">No saved posts yet.</p>
      )}
      {posts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}

export default BookmarksPage;
