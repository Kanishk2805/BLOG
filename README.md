# ScreenScope
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

## Setup Instructions
1. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```
2. Create backend env file:
   - Copy `server/.env.example` to `server/.env`
   - Set `MONGODB_URI`, `CLIENT_ORIGIN`, and `JWT_SECRET`
3. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```
4. Create frontend env file:
   - Copy `client/.env.example` to `client/.env`
   - Confirm `VITE_API_BASE_URL`

## Run in Development
1. Start backend:
   ```bash
   cd server
   npm run dev
   ```
2. In another terminal, start frontend:
   ```bash
   cd client
   npm run dev
   ```
3. Open:
   - Frontend: `http://localhost:5173`
   - Backend health check: `http://localhost:5000/api/health`
   - Auth profile check (with bearer token): `http://localhost:5000/api/auth/me`

## Testing Phase 2 (Auth)
1. Register:
   - `POST /api/auth/register` with `name`, `email`, `password`
   - Expected: `201` with `token` and `user`
2. Login:
   - `POST /api/auth/login` with `email`, `password`
   - Expected: `200` with `token` and `user`
3. Protected route:
   - `GET /api/auth/me` with `Authorization: Bearer <token>`
   - Expected: `200` and current user data
4. Frontend auth flow:
   - Open `/register`, create account, redirect to `/dashboard`
   - Logout from navbar, then open `/dashboard`
   - Expected: redirect to `/login`

## Testing Phase 3 (Core APIs)
1. Users:
   - `GET /api/users`
   - `GET /api/users/:id`
   - `DELETE /api/users/:id`
2. Posts:
   - `GET /api/posts`
   - `POST /api/posts`
   - `PUT /api/posts/:id`
   - `DELETE /api/posts/:id`
3. Ratings:
   - `POST /api/ratings`
   - `GET /api/ratings/:postId`

## Testing Phase 4 (Frontend UI + Routing)
1. Visit `/`:
   - Hero and latest posts section should render.
2. Visit `/browse`:
   - Search/type/rating filters should load posts from backend.
3. Visit an unknown route like `/abc`:
   - 404 page should render with a "Go Home" action.

## Testing Phase 5 (Post CRUD UI)
1. Open `/posts/new` (authenticated) and publish a review.
2. Open `/my-posts` and confirm review list loads.
3. Click edit and save changes (`/posts/:id/edit`).
4. Delete a review from `/my-posts`.

## Testing Phase 6 (Profile + PDF)
1. Open `/profile` (authenticated).
2. Confirm user info and recent authored posts load.
3. Click `Download PDF` and verify `screenscope-profile.pdf` is generated.

## Testing Phase 7 (Admin Panel)
1. Promote one user to admin in MongoDB (`role: "admin"`).
2. Login as admin and open `/admin`.
3. Verify stats, users list, and posts moderation list load.
4. Verify non-admin request to `/api/admin/stats` returns `403`.

## Testing Phase 8 (Advanced Features)
1. In `/browse`, use search + type + rating + genre filters and clear filters.
2. As an authenticated user, click `Like` and `Save` on post cards.
3. Open `/bookmarks` and verify saved posts appear.
4. Switch navbar accent theme (`Cyan`, `Rose`, `Emerald`, `Amber`) and confirm brand color changes.

## Testing Phase 9 (Final Polish)
1. Verify page transition animation when navigating between routes.
2. Shrink viewport to mobile width and verify hamburger menu navigation works.
3. Confirm desktop navbar still shows full links and theme controls.
4. Build frontend with `npm run build` and verify success.

## Deployment Notes
1. Frontend (`client`) is ready for Vercel SPA deployment using [vercel.json](/C:/Users/darkl/Downloads/job-portal/Blog/client/vercel.json).
2. Backend (`server`) includes Render blueprint [render.yaml](/C:/Users/darkl/Downloads/job-portal/Blog/server/render.yaml).
3. Required backend env vars in production:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_ORIGIN`
   - `JWT_EXPIRES_IN` (optional, default `7d`)

## Testing Phase 1
1. Backend health endpoint:
   - Visit `/api/health`
   - Expected response: JSON with status `ok`
2. Frontend render check:
   - Home page loads with navigation and a "Phase 2 auth flow ready" card
3. API wiring check:
   - Frontend "Test Backend Connection" button should show backend status if server is running

## Notes
- JWT is implemented for this phase so development can continue locally without Clerk secrets.
- Remaining domain models and feature APIs are deferred to next phases.
