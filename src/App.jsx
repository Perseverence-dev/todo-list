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

function App() {
  return (
    <div className="app">
      <Header />

      <main className="container">
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />

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

        {/* Wildcard stays last so it only matches unknown URLs. */}
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="appFooter">
        <p>
          Todo List · built with React, React Router &amp; Vite ·{' '}
          <a
            href="https://github.com/Perseverence-Dev/todo-list"
            target="_blank"
            rel="noopener noreferrer"
          >
            View source
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;