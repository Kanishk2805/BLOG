import { useMemo, useState } from "react";
import { getPostImage } from "../../utils/postVisuals.js";

const defaultValues = {
  title: "",
  description: "",
  content: "",
  type: "movie",
  genre: "general",
  tags: "",
  imageUrl: ""
};

function PostForm({ initialValues, onSubmit, submitLabel, isSubmitting }) {
  const mergedDefaults = useMemo(
    () => ({ ...defaultValues, ...initialValues }),
    [initialValues]
  );
  const [form, setForm] = useState(mergedDefaults);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean)
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <img src={getPostImage(form)} alt="Preview" className="h-48 w-full object-cover" />
      </div>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        required
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Short description"
        required
        rows={3}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
      />
      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="Full review content (Markdown/text)"
        rows={6}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
      />
      <div className="grid gap-3 md:grid-cols-2">
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        >
          <option value="movie">Movie</option>
          <option value="show">Show</option>
          <option value="anime">Anime</option>
        </select>
        <input
          name="genre"
          value={form.genre}
          onChange={handleChange}
          placeholder="Genre"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
      </div>
      <input
        name="tags"
        value={form.tags}
        onChange={handleChange}
        placeholder="Tags (comma-separated)"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
      />
      <input
        name="imageUrl"
        value={form.imageUrl}
        onChange={handleChange}
        placeholder="Image URL (optional)"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-70"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

export default PostForm;
