import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { mode, accent, setAccent, toggleMode } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navItemClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200"
        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
    }`;

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <nav className="mx-auto w-full max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
        <Link className="text-xl font-bold tracking-tight text-brand-700 dark:text-brand-300" to="/">
          ANINerd
        </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 md:hidden dark:border-slate-700 dark:text-slate-200"
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>

          <div className="hidden items-center gap-2 md:flex">
          <NavLink
            to="/"
            className={navItemClass}
          >
            Home
          </NavLink>
          <NavLink to="/browse" className={navItemClass}>
            Browse
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/posts/new" className={navItemClass}>
                Write
              </NavLink>
              <NavLink to="/profile" className={navItemClass}>
                Profile
              </NavLink>
              <NavLink to="/bookmarks" className={navItemClass}>
                Saved
              </NavLink>
              {user?.role === "admin" && (
                <NavLink to="/admin" className={navItemClass}>
                  Admin
                </NavLink>
              )}
              <NavLink to="/dashboard" className={navItemClass}>
                Dashboard
              </NavLink>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Logout ({user?.name})
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Register
              </NavLink>
            </>
          )}

          <select
            value={accent}
            onChange={(event) => setAccent(event.target.value)}
            className="rounded-md border border-slate-300 px-2 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <option value="cyan">Cyan</option>
            <option value="rose">Rose</option>
            <option value="emerald">Emerald</option>
            <option value="amber">Amber</option>
          </select>

          <button
            type="button"
            onClick={toggleMode}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {mode === "light" ? "Dark" : "Light"}
          </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="mb-3 space-y-2 rounded-xl border border-slate-200 bg-white p-3 md:hidden dark:border-slate-800 dark:bg-slate-900">
            <NavLink to="/" className={navItemClass} onClick={() => setIsMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/browse" className={navItemClass} onClick={() => setIsMenuOpen(false)}>
              Browse
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/posts/new" className={navItemClass} onClick={() => setIsMenuOpen(false)}>
                  Write
                </NavLink>
                <NavLink to="/profile" className={navItemClass} onClick={() => setIsMenuOpen(false)}>
                  Profile
                </NavLink>
                <NavLink to="/bookmarks" className={navItemClass} onClick={() => setIsMenuOpen(false)}>
                  Saved
                </NavLink>
                {user?.role === "admin" && (
                  <NavLink to="/admin" className={navItemClass} onClick={() => setIsMenuOpen(false)}>
                    Admin
                  </NavLink>
                )}
                <NavLink to="/dashboard" className={navItemClass} onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </NavLink>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-left text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  Logout ({user?.name})
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navItemClass} onClick={() => setIsMenuOpen(false)}>
                  Login
                </NavLink>
                <NavLink to="/register" className={navItemClass} onClick={() => setIsMenuOpen(false)}>
                  Register
                </NavLink>
              </>
            )}
            <div className="flex items-center gap-2 pt-1">
              <select
                value={accent}
                onChange={(event) => setAccent(event.target.value)}
                className="flex-1 rounded-md border border-slate-300 px-2 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="cyan">Cyan</option>
                <option value="rose">Rose</option>
                <option value="emerald">Emerald</option>
                <option value="amber">Amber</option>
              </select>
              <button
                type="button"
                onClick={toggleMode}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                {mode === "light" ? "Dark" : "Light"}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
