import Link from 'next/link';
import { getAllVideos } from '@/lib/videos';
import type { Video } from '@/types/video';

const CLASS_LEVELS = ['Class V', 'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X'];
const CLASS_COLORS = ['purple', 'teal', 'pink', 'orange', 'blue', 'green'];

function groupVideosByClass(videos: Video[]) {
  return CLASS_LEVELS.map((className) => ({
    className,
    videos: videos.filter((video) => video.grade_level.trim().toLowerCase() === className.toLowerCase()),
  }));
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="folder-icon">
      <path d="M8 17.5A5.5 5.5 0 0 1 13.5 12h14l6 7h17A5.5 5.5 0 0 1 56 24.5v22A5.5 5.5 0 0 1 50.5 52h-37A5.5 5.5 0 0 1 8 46.5v-29Z" />
      <path className="folder-tab" d="M8 25h48v21.5a5.5 5.5 0 0 1-5.5 5.5h-37A5.5 5.5 0 0 1 8 46.5V25Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="arrow-icon">
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

export default async function HomePage() {
  const videos = await getAllVideos();
  const classGroups = groupVideosByClass(videos);

  return (
    <main className="page-shell class-home">
      <header className="topbar">
        <div className="container navbar">
          <Link href="/" className="brand">Education4all</Link>
          <nav className="nav-links">
            <Link href="#classes">Classes</Link>
            <Link href="#library">All videos</Link>
          </nav>
        </div>
      </header>

      <section className="class-hero">
        <div className="container">
          <p className="eyebrow">Learn at your level</p>
          <h1>Choose your class</h1>
          <p className="hero-copy">Find academic lessons organized for Classes V to X.</p>
        </div>
      </section>

      <section id="classes" className="class-section">
        <div className="container">
          <div className="section-heading class-heading">
            <p className="eyebrow">Education4all library</p>
            <h2>Explore by class</h2>
          </div>

          <div className="class-list">
            {classGroups.map(({ className, videos: classVideos }, index) => (
              <a href={`#${className.toLowerCase().replace(' ', '-')}`} className={`class-card ${CLASS_COLORS[index]}`} key={className}>
                <div className="class-folder"><FolderIcon /></div>
                <div className="class-card-content">
                  <h3>{className}</h3>
                  <p><span className="book-icon" aria-hidden="true">▮▮</span>{classVideos.length} {classVideos.length === 1 ? 'Course' : 'Courses'}</p>
                </div>
                <span className="class-arrow"><ArrowIcon /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="library" className="class-library">
        <div className="container">
          {classGroups.map(({ className, videos: classVideos }) => (
            <section id={className.toLowerCase().replace(' ', '-')} className="class-course-section" key={className}>
              <div className="section-heading class-heading-row">
                <div>
                  <p className="eyebrow">{className}</p>
                  <h2>{classVideos.length ? 'Course videos' : 'Coming soon'}</h2>
                </div>
                <span className="course-count">{classVideos.length} {classVideos.length === 1 ? 'course' : 'courses'}</span>
              </div>

              {classVideos.length > 0 ? (
                <div className="video-grid">
                  {classVideos.map((video) => (
                    <Link href={`/watch/${video.slug}`} key={video.id} className="video-card">
                      <div className="thumb-wrap">
                        <img src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`} alt={video.title} />
                      </div>
                      <div className="card-body">
                        <span className="tag">{video.subject}</span>
                        <h3>{video.title}</h3>
                        <p>{video.description}</p>
                        <div className="meta-row"><span>{video.topic}</span><span>{video.duration}</span></div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="empty-class">New lessons for {className} will be added soon.</div>
              )}
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
