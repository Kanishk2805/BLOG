import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../api/http.js";
import { useAuth } from "../context/AuthContext.jsx";
import PostCard from "../components/posts/PostCard.jsx";

function HomePage() {
  const { isAuthenticated } = useAuth();
  // ...existing code...
  const [latestPosts, setLatestPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [recommendedPosts, setRecommendedPosts] = useState([]);

  const recentlyViewed = useMemo(
    () => JSON.parse(localStorage.getItem("screenscope_recently_viewed") || "[]"),
    []
  );

  useEffect(() => {
    const fetchHomeFeed = async () => {
      try {
        const [{ data: latestData }, { data: trendingData }] = await Promise.all([
          http.get("/posts?limit=6"),
          http.get("/posts?minRating=4&limit=6")
        ]);
        const latest = latestData.posts || [];
        const trending = trendingData.posts || [];
        setLatestPosts(latest.slice(0, 3));
        setTrendingPosts(trending.slice(0, 3));
        setRecommendedPosts((latest.length > 3 ? latest.slice(3, 6) : latest.slice(0, 3)) || []);
      } catch (_error) {
        setLatestPosts([]);
        setTrendingPosts([]);
        setRecommendedPosts([]);
      }
    };

    fetchHomeFeed();
  }, []);

  // ...existing code...

  return (
    <section className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-100 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300">
          ScreenScope
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Discover what to watch next through real community reviews.
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          Browse ratings for movies, shows, and anime. Create your profile, post reviews, and track
          your viewing opinions.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/browse"
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Explore Reviews
          </Link>
          {!isAuthenticated && (
            <>
              <Link
                to="/register"
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Login
              </Link>
            </>
          )}
        </div>
        {/* ...existing code... */}
      </motion.div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold tracking-tight">Latest Reviews</h3>
          <Link to="/browse" className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300">
            View all
          </Link>
        </div>
        {latestPosts.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            No reviews yet. Create one in the next phase, or use API now.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {latestPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold tracking-tight">Trending Now</h3>
          <Link to="/browse?minRating=4" className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300">
            Top rated
          </Link>
        </div>
        {trendingPosts.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">Trending section will appear as ratings grow.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {trendingPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold tracking-tight">Recommended For You</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Fresh picks from what the community is currently reviewing.
          </p>
          <div className="mt-4 space-y-3">
            {recommendedPosts.slice(0, 3).map((post) => (
              <Link
                key={post._id}
                to={`/posts/${post._id}`}
                className="block rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <p className="font-semibold">{post.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {post.type} • {Number(post.averageRating || 0).toFixed(1)}/5
                </p>
              </Link>
            ))}
            {recommendedPosts.length === 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-300">No recommendations yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold tracking-tight">Recently Viewed</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Your latest opened post pages are saved locally.
          </p>
          <div className="mt-4 space-y-3">
            {recentlyViewed.slice(0, 4).map((post) => (
              <Link
                key={post._id}
                to={`/posts/${post._id}`}
                className="block rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <p className="font-semibold">{post.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{post.type}</p>
              </Link>
            ))}
            {recentlyViewed.length === 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-300">No recently viewed posts yet.</p>
            )}
          </div>
        </div>
      </section>
    </section>
  );
}

export default HomePage;
