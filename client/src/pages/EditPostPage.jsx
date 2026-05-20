import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostForm from "../components/posts/PostForm.jsx";
import { http } from "../api/http.js";

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const { data } = await http.get(`/posts/${id}`);
        const currentPost = data.post;
        setPost({
          title: currentPost.title,
          description: currentPost.description,
          content: currentPost.content || "",
          type: currentPost.type,
          genre: currentPost.genre || "general",
          tags: (currentPost.tags || []).join(", "),
          imageUrl: currentPost.imageUrl || ""
        });
      } catch (_error) {
        setError("Could not load this post.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (payload) => {
    try {
      setIsSubmitting(true);
      setError("");
      await http.put(`/posts/${id}`, payload);
      navigate("/my-posts");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">Loading post...</p>;
  }

  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-2xl font-semibold tracking-tight">Edit Review</h2>
      {error && <p className="mt-3 text-sm text-rose-600 dark:text-rose-300">{error}</p>}
      {post && (
        <div className="mt-5">
          <PostForm
            initialValues={post}
            submitLabel="Save Changes"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </section>
  );
}

export default EditPostPage;
