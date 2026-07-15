# GVCC-Assignment-Learning-Portal-Development
This is a assignment of GVCC
# GVCC Learning Portal

A student learning portal built with **React + Vite + Tailwind CSS**. Students can browse a course catalogue, watch videos, drop multiple named bookmarks per video, and resume playback from any bookmark with one click. No backend/database server is required — the app persists everything (accounts, bookmarks, watch progress) in the browser via `localStorage`, so it deploys as a static site on Vercel with zero configuration.

## Live Demo
After deploying (see below), your URL will look like: `https://your-project-name.vercel.app`

## Tech Stack
- **React 18** + **Vite 5** — SPA framework/build tool
- **React Router 6** — client-side routing
- **Tailwind CSS 3** — styling
- **localStorage** — persistence layer (bookmarks, progress, accounts, session)

No backend server, database, or `.env` secrets are needed to run this project.

---

## Getting Started (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev
# → opens on http://localhost:5173

# 3. Build for production
npm run build

# 4. Preview the production build locally
npm run preview
```

Requires Node.js 18+.

---

## Deploying to Vercel

**Option A — Vercel Dashboard**
1. Push this repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Framework preset: **Vite** (auto-detected). Build command: `npm run build`. Output directory: `dist`.
4. Click **Deploy**.

**Option B — Vercel CLI**
```bash
npm i -g vercel
vercel        # first deploy (follow prompts)
vercel --prod # promote to production
```

The included `vercel.json` adds an SPA rewrite rule so client-side routes (e.g. `/video/v1`) don't 404 on refresh.

---

## Feature Overview

### 1. Learning Portal
- Home page with a searchable, filterable course catalogue (`src/pages/Home.jsx`).
- Dedicated watch page per video with a custom player (`src/pages/VideoPage.jsx`).

### 2. Video Bookmark Feature
- Students can create **unlimited named bookmarks per video** (`src/components/BookmarkForm.jsx`).
- Each bookmark stores `id`, `videoId`, `name` (optional — auto-named from timestamp if left blank), `timestamp`, `createdAt`.
- All bookmarks for the current video are listed, sorted by timestamp (`src/components/BookmarkList.jsx`).
- Clicking a bookmark calls `player.seekTo(timestamp)` via a `ref`/`useImperativeHandle` on the `<video>` element, so playback jumps to that exact second — not from `0:00`.
- **Bonus:** bookmarks can be renamed inline or deleted.
- Storage: `src/context/BookmarkContext.jsx` persists bookmarks to `localStorage`, namespaced per logged-in user (or `guest` if not logged in), so switching accounts on one browser doesn't mix data.

### 3. Screenshot Protection Approach
Browsers intentionally **do not** expose an API to block OS-level screenshots (PrintScreen, `Cmd+Shift+4`, a phone's screenshot gesture) or a phone/camera pointed at the screen — this is a deliberate security boundary, not a gap in this app. True prevention requires OS/platform support (e.g., Android's `FLAG_SECURE`, iOS `UIScreen.isCaptured` detection, or DRM'd video via a service like Widevine/FairPlay on native apps).

Given that, this project implements the strongest **web-appropriate deterrents**, documented in `src/components/ScreenshotProtection.jsx` and `src/components/VideoPlayer.jsx`:

| Mechanism | What it does |
|---|---|
| Keyboard/menu blocking | Disables right-click, `Ctrl/Cmd+P` (print), `Ctrl/Cmd+S` (save page), `Ctrl/Cmd+U` (view-source), DevTools shortcuts (`F12`, `Ctrl+Shift+I/J/C`), and the `PrintScreen` key where the browser allows interception. |
| `controlsList="nodownload"` | Removes the native browser "Download" button from the video controls. |
| CSS `user-select: none` | Prevents easy text/element selection and drag-out of the video frame. |
| Visibility/blur shield | When the tab loses focus or becomes hidden (a common moment for OS screenshot tools/screen recorders to be invoked), playback auto-pauses and the video is blanked behind an overlay. |
| Per-viewer watermark | A tiled, semi-transparent overlay showing the logged-in student's name/email is rendered over the video. It doesn't stop a capture, but it makes any leaked screenshot/recording traceable back to the account that produced it — the same approach used by many commercial e-learning platforms. |
| `@media print` rule | If someone still triggers a print dialog, the page content is hidden and replaced with a notice. |

**For a production deployment** where hard enforcement is a requirement, the recommended upgrade path is documented for the evaluator:
- Serve video through a provider with **DRM support** (e.g., Mux, Cloudflare Stream, AWS MediaConvert + CloudFront signed URLs, Vimeo/YouTube unlisted with domain restriction) instead of a raw `<video src>` file.
- Ship a **native app** (React Native / Flutter) for mobile users, where `FLAG_SECURE` (Android) and screen-recording detection (iOS) can genuinely block/blank captures at the OS level — impossible from a browser tab.

### Bonus Features Implemented
- ✅ Edit/delete bookmarks
- ✅ Bookmark titles (optional, auto-generated if blank)
- ✅ Continue Watching page, sorted by most recently viewed
- ✅ Watch-progress bar on every course card + continue-watching row
- ✅ Recently watched videos list
- ✅ Authentication (signup/login/logout) — demo-grade, `localStorage`-backed (see note below)
- ✅ Responsive UI (mobile, tablet, desktop breakpoints via Tailwind)

> **Auth note:** To keep this a zero-backend static deployment, accounts/sessions live in `localStorage` (`src/context/AuthContext.jsx`). This is intentionally **not** production-grade auth (passwords aren't hashed, there's no server-side validation). For production, swap this context's internals for a real API — e.g., Firebase Auth, Supabase Auth, or a custom Node/Express + JWT backend — without touching any other component, since all auth access goes through the single `useAuth()` hook.

---

## Project Structure
```
learning-portal/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── VideoCard.jsx
│   │   ├── VideoPlayer.jsx          # custom player, watermark, privacy shield
│   │   ├── BookmarkForm.jsx
│   │   ├── BookmarkList.jsx
│   │   └── ScreenshotProtection.jsx # app-wide capture deterrents
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── BookmarkContext.jsx      # bookmarks + progress + recent, localStorage-backed
│   ├── data/videos.js               # demo course catalogue
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── VideoPage.jsx
│   │   ├── ContinueWatching.jsx
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── utils/{storage.js,time.js}
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── vercel.json
└── package.json
```

## Swapping in Your Own Videos
Edit `src/data/videos.js` — each entry needs `id`, `title`, `instructor`, `category`, `duration`, `thumbnail`, `src` (a direct video URL or CDN link), and `description`.

## Bookmark Data Model
```js
{
  id: 'uuid',
  videoId: 'v1',
  name: 'Key formula explained',   // optional, user-provided
  timestamp: 645,                  // seconds
  createdAt: 1737000000000
}
```

## License
Built for the GVCC Learning Portal assignment. Sample videos are Creative-Commons test clips used for demo purposes only — replace with licensed course content before real-world use.
