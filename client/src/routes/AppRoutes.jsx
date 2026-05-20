import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/layout/Navbar.jsx";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import ProtectedRoute from "../components/auth/ProtectedRoute.jsx";
import AdminRoute from "../components/auth/AdminRoute.jsx";
import BrowsePage from "../pages/BrowsePage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import CreatePostPage from "../pages/CreatePostPage.jsx";
import EditPostPage from "../pages/EditPostPage.jsx";
import MyPostsPage from "../pages/MyPostsPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import AdminPage from "../pages/AdminPage.jsx";
import BookmarksPage from "../pages/BookmarksPage.jsx";
import PostDetailsPage from "../pages/PostDetailsPage.jsx";

function AppRoutes() {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/posts/new" element={<CreatePostPage />} />
                <Route path="/posts/:id/edit" element={<EditPostPage />} />
                <Route path="/my-posts" element={<MyPostsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/bookmarks" element={<BookmarksPage />} />
              </Route>
              <Route path="/posts/:id" element={<PostDetailsPage />} />
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default AppRoutes;
