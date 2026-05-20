# ANINerd
A production-ready full-stack foundation with polished UX, responsive navigation, and deployment configuration.

## Tech Stack
- Frontend: React + Vite + Tailwind CSS + React Router + Axios
- Backend: Node.js + Express + Mongoose
- Database: MongoDB
- Authentication: JWT (register/login/protected routes)

## Folder Structure
```text
.
|-- client
|   |-- index.html
|   |-- package.json
|   |-- postcss.config.js
|   |-- tailwind.config.js
|   |-- vite.config.js
|   |-- vercel.json
|   |-- .env.example
|   |-- render.yaml
|   `-- src
|       |-- api
|       |   `-- http.js
|       |-- components
|       |   |-- auth
|       |   |   `-- AdminRoute.jsx
|       |   |   `-- ProtectedRoute.jsx
|       |   |-- posts
|       |   |   `-- PostForm.jsx
|       |   |   `-- PostCard.jsx
|       |   `-- layout
|       |       `-- Navbar.jsx
|       |-- context
|       |   |-- AuthContext.jsx
|       |   `-- ThemeContext.jsx
|       |-- pages
|       |   |-- AdminPage.jsx
|       |   |-- BookmarksPage.jsx
|       |   |-- BrowsePage.jsx
|       |   |-- CreatePostPage.jsx
|       |   |-- DashboardPage.jsx
|       |   |-- EditPostPage.jsx
|       |   `-- HomePage.jsx
|       |   |-- LoginPage.jsx
|       |   |-- MyPostsPage.jsx
|       |   |-- NotFoundPage.jsx
|       |   |-- ProfilePage.jsx
|       |   `-- RegisterPage.jsx
|       |-- routes
|       |   `-- AppRoutes.jsx
|       |-- App.jsx
|       |-- index.css
|       `-- main.jsx
|-- server
|   |-- package.json
|   |-- .env.example
|   `-- src
|       |-- config
|       |   |-- db.js
|       |   `-- env.js
|       |-- controllers
|       |   |-- admin.controller.js
|       |   |-- auth.controller.js
|       |   `-- health.controller.js
|       |   |-- interactions.controller.js
|       |   |-- posts.controller.js
|       |   |-- ratings.controller.js
|       |   `-- users.controller.js
|       |-- models
|       |   |-- Bookmark.js
|       |   |-- Comment.js
|       |   |-- Like.js
|       |   |-- Post.js
|       |   |-- Rating.js
|       |   `-- User.js
|       |-- middleware
|       |   |-- auth.js
|       |   |-- errorHandler.js
|       |   `-- notFound.js
|       |-- routes
|       |   |-- admin.routes.js
|       |   |-- auth.routes.js
|       |   |-- health.routes.js
|       |   |-- interactions.routes.js
|       |   |-- posts.routes.js
|       |   |-- ratings.routes.js
|       |   `-- users.routes.js
|       |   `-- index.js
|       |-- utils
|       |   `-- generateToken.js
|       |-- app.js
|       `-- server.js
`-- .gitignore
```
