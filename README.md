# Todo List — React Task Manager

A full-featured todo application built with React. It supports user
authentication, full CRUD on tasks, client-side routing with protected pages,
and shareable URL-based filtering. This project demonstrates modern React
patterns — hooks, `useReducer` state management, Context, React Router, and
performance-conscious rendering — wrapped in a clean, responsive UI.

> Built for the [Code the Dream](https://codethedream.org/) React curriculum.

## 🚀 Live Demo

[View Live Application](https://your-app.vercel.app) <!-- TODO: replace with Vercel URL after deploying -->

## 📸 Screenshots

<!-- TODO: add screenshots to a /screenshots folder and update these paths -->

![Desktop view of the todo list](./screenshots/desktop.png)
![Mobile view of the todo list](./screenshots/mobile.png)

![Login page view of the todo list](./screenshots/login.png)
![Profile page view of the todo list](./screenshots/profile.png)

## ✨ Features

- **User authentication** — log on / log off backed by a session + CSRF token
- **Full CRUD** — create, read, update, and complete todos with a pessimistic UI
- **Client-side routing** — Home, About, Login, Todos, and Profile pages (React Router v7)
- **Protected routes** — `/todos` and `/profile` require authentication and
  redirect to login, preserving the intended destination
- **URL-based status filtering** — `/todos?status=completed` is bookmarkable and
  shareable, and works with the browser's back/forward buttons
- **Sorting & search** — sort by date or title and filter todos by text (debounced)
- **Profile statistics** — total, completed, and active counts with a completion rate
- **404 handling** — friendly catch-all page with recovery links
- **Responsive & accessible** — mobile-first layout, keyboard focus styles, and
  screen-reader labels

## 🛠️ Technologies Used

- **Framework:** React 19
- **Routing:** React Router v7
- **State Management:** `useReducer` + Context API
- **Styling:** CSS Modules with a CSS-variable design-token system
- **Security:** DOMPurify for input sanitization
- **Build Tool:** Vite
- **Linting:** ESLint
- **Deployment:** Vercel <!--TODO-->

## 🏗️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+ and npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Perseverence-Dev/todo-list.git
   cd todo-list
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

> The app talks to the Code the Dream backend through relative `/api/*` paths.
> In development these are forwarded by the Vite dev-server proxy; in production
> the included `vercel.json` rewrites them to the backend.

## 📜 Available Scripts

| Script            | Description                                       |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Start the Vite development server with hot reload  |
| `npm run build`   | Create an optimized production build in `dist/`    |
| `npm run preview` | Serve the production build locally to test it      |
| `npm run lint`    | Run ESLint across the project                      |

## 🎨 Design Decisions

- **CSS Modules** were chosen for styling so class names are scoped to each
  component, eliminating the global-namespace conflicts that plain CSS causes as
  a project grows.
- A small **design-token system** (CSS custom properties in `index.css`) defines
  the color palette, spacing scale, typography, radii, and shadows in one place,
  keeping the UI consistent and easy to re-theme.
- **Pages vs. features vs. shared** — route-level components live in `pages/`,
  feature logic in `features/`, and reusable UI in `shared/`, with a single
  `RequireAuth` wrapper centralizing route protection.
- **Security:** user input is validated and then sanitized with **DOMPurify**
  before being sent to the API, length limits are applied to all text inputs,
  and no secrets are stored in client code (only the public, server-issued CSRF
  token is held in memory/session).

## 🔮 Future Improvements

- Dark / light theme toggle
- Drag-and-drop reordering of todos
- Optimistic UI updates with rollback
- Unit and integration tests (Vitest + React Testing Library)
- Progressive Web App (offline) support




- GitHub: [@Perseverence-Dev](https://github.com/Perseverence-Dev)
