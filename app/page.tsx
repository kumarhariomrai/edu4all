import Link from 'next/link';
import { getAllVideos, getFeaturedVideos, getSubjects } from '@/lib/videos';

export default async function HomePage() {
  const videos = await getAllVideos();
  const featured = getFeaturedVideos(videos);
  const subjects = getSubjects(videos);

  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="container navbar">
          <div className="brand">Education4all</div>
          <nav className="nav-links">
            <Link href="#featured">Featured</Link>
            <Link href="#subjects">Subjects</Link>
            <Link href="#library">Library</Link>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-inner">
          <div>
            <p className="eyebrow">Learning for every stage</p>
            <h1>Academic videos built for curious minds.</h1>
            <p className="hero-copy">
              Explore engaging lessons, topics, and classroom-ready learning resources for school and self-study.
            </p>
            <div className="cta-row">
              <a href="#library" className="primary-btn">Browse videos</a>
              <a href="#featured" className="secondary-btn">Featured lessons</a>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <strong>{videos.length}</strong>
              <span>Videos</span>
            </div>
            <div className="stat-card">
              <strong>{subjects.length}</strong>
              <span>Subjects</span>
            </div>
            <div className="stat-card">
              <strong>{featured.length}</strong>
              <span>Featured</span>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Featured</p>
            <h2>Recommended lessons</h2>
          </div>

          <div className="video-grid">
            {featured.map((video) => (
              <Link href={`/watch/${video.slug}`} key={video.id} className="video-card feature-card">
                <div className="thumb-wrap">
                  <img src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`} alt={video.title} />
                </div>
                <div className="card-body">
                  <span className="tag">{video.subject}</span>
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                  <div className="meta-row">
                    <span>{video.grade_level}</span>
                    <span>{video.duration}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="subjects" className="section muted">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Browse by subject</p>
            <h2>Popular learning areas</h2>
          </div>

          <div className="subject-grid">
            {subjects.map((subject) => (
              <div key={subject} className="subject-card">
                <span>{subject}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="library" className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Library</p>
            <h2>All learning videos</h2>
          </div>

          <div className="video-grid">
            {videos.map((video) => (
              <Link href={`/watch/${video.slug}`} key={video.id} className="video-card">
                <div className="thumb-wrap">
                  <img src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`} alt={video.title} />
                </div>
                <div className="card-body">
                  <span className="tag">{video.subject}</span>
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                  <div className="meta-row">
                    <span>{video.grade_level}</span>
                    <span>{video.duration}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
