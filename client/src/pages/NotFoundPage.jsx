import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm uppercase tracking-wider text-slate-500">404</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        The page you requested does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-5 inline-flex rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Go Home
      </Link>
    </section>
  );
}

export default NotFoundPage;
