/**
 * Public, bookmarkable informational page about the app.
 * Accessible whether or not the user is authenticated.
 */
function AboutPage() {
  return (
    <main className="about">
      <h2>About This App</h2>
      <p>
        A todo manager built for the Code the Dream React course to practice
        modern React patterns and client-side routing.
      </p>

      <section>
        <h3>Features</h3>
        <ul>
          <li>Create, complete, and edit todos with a pessimistic UI</li>
          <li>Sort, text-filter, and status-filter todos</li>
          <li>Shareable, bookmarkable status filters stored in the URL</li>
          <li>Authentication-protected pages with redirect preservation</li>
        </ul>
      </section>

      <section>
        <h3>Built With</h3>
        <ul>
          <li>React</li>
          <li>React Router v7</li>
          <li>Vite</li>
        </ul>
      </section>
    </main>
  );
}

export default AboutPage;
