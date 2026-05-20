import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../components/posts/PostForm.jsx";
import { http } from "../api/http.js";

function CreatePostPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (payload) => {
    try {
      setIsSubmitting(true);
      setError("");
      const { data } = await http.post("/posts", payload);
      navigate(`/posts/${data.post._id}/edit`, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not create post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-2xl font-semibold tracking-tight">Create Review</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Publish a movie, show, or anime review.
      </p>
      {error && <p className="mt-3 text-sm text-rose-600 dark:text-rose-300">{error}</p>}
      <div className="mt-5">
        <PostForm submitLabel="Publish Review" onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </section>
  );
}

export default CreatePostPage;
