import { useEffect, useMemo, useState } from "react";
import PostCard from "../components/posts/PostCard.jsx";
import { http } from "../api/http.js";

const defaultFilters = {
  q: "",
  type: "",
  genre: "",
  minRating: ""
};

function BrowsePage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.q.trim()) params.set("q", filters.q.trim());
    if (filters.type) params.set("type", filters.type);
    if (filters.genre.trim()) params.set("genre", filters.genre.trim().toLowerCase());
    if (filters.minRating) params.set("minRating", filters.minRating);
    return params.toString();
  }, [filters]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError("");
        const url = queryParams ? `/posts?${queryParams}` : "/posts";
        const { data } = await http.get(url);
        setPosts(data.posts || []);
      } catch (_error) {
        setError("Could not load posts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [queryParams]);

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative h-40">
          <img
            src="https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1600&q=80"
            alt="Cinema backdrop"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 to-transparent" />
          <div className="absolute inset-0 flex items-end p-5">
            <h2 className="text-2xl font-semibold tracking-tight text-white">Browse Reviews</h2>
          </div>
        </div>
        <div className="p-5">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Search and filter by media type and rating.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <input
            type="text"
            value={filters.q}
            onChange={(event) => setFilters((prev) => ({ ...prev, q: event.target.value }))}
            placeholder="Search title, tags, keywords"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950"
          />
          <select
            value={filters.type}
            onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">All types</option>
            <option value="movie">Movies</option>
            <option value="show">Shows</option>
            <option value="anime">Anime</option>
          </select>
          <select
            value={filters.minRating}
            onChange={(event) => setFilters((prev) => ({ ...prev, minRating: event.target.value }))}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">Any rating</option>
            <option value="4">4+ stars</option>
            <option value="3">3+ stars</option>
            <option value="2">2+ stars</option>
          </select>
          <input
            type="text"
            value={filters.genre}
            onChange={(event) => setFilters((prev) => ({ ...prev, genre: event.target.value }))}
            placeholder="Genre (sci-fi, drama...)"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950"
          />
        </div>
        <button
          type="button"
          onClick={() => setFilters(defaultFilters)}
          className="mt-3 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Clear Filters
        </button>
        </div>
      </div>

      {isLoading && <p className="text-sm text-slate-600 dark:text-slate-300">Loading posts...</p>}
      {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}
      {!isLoading && !error && posts.length === 0 && (
        <p className="text-sm text-slate-600 dark:text-slate-300">No posts match your filters yet.</p>
      )}

      {!isLoading && posts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}

export default BrowsePage;
