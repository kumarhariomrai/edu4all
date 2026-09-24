export default function NotFoundPage() {
  return (
    <main className="page-shell narrow-page">
      <div className="container empty-state">
        <h1>Video not found</h1>
        <p>The requested lesson could not be found.</p>
        <a href="/" className="primary-btn">Return home</a>
      </div>
    </main>
  );
}
