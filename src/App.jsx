import './App.css';
import { Routes, Route } from 'react-router';
import Header from './shared/Header';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import TodosPage from './pages/TodosPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import RequireAuth from './components/RequireAuth';

// Week 10: conditional rendering replaced with client-side routing.
function App() {
  return (
    <>
      {/* Header (with navigation) renders outside <Routes> so it persists
          across every page. */}
      <Header />

      <Routes>
        {/* Public routes — reachable without authentication. */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes — RequireAuth gates access and preserves the
            user's intended destination for post-login redirect. */}
        <Route
          path="/todos"
          element={
            <RequireAuth>
              <TodosPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />

        {/* Catch-all must be last: <Routes> renders the first match, so an
            earlier "*" would shadow every other route. */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;