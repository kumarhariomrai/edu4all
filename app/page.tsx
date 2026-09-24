import Link from 'next/link';
import { getAllVideos } from '@/lib/videos';

const CLASS_LEVELS = ['Class IX', 'Class X', 'Class XI', 'Class XII'];
const CLASS_COLORS = ['purple', 'teal', 'pink', 'orange'];

function groupVideosByClass(videos: typeof import('@/lib/videos').Video[]) {
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
      <header className="topbar career-header">
        <div className="container navbar">
          <div className="brand-row">
            <button className="menu-btn" aria-label="Menu">
              <span />
              <span />
              <span />
            </button>
            <Link href="/" className="brand career-brand">Career Will</Link>
          </div>

          <div className="logo-mark" aria-label="Career Will logo">
            <span className="logo-shape" />
          </div>
        </div>
      </header>

      <section className="class-toolbar">
        <div className="container toolbar-row">
          <div className="search-box">
            <span className="search-icon">⌕</span>
            <span>Search Here...</span>
          </div>
          <button className="favourite-btn">My Favourite</button>
        </div>
      </section>

      <section id="classes" className="class-section">
        <div className="container class-list">
          {classGroups.map(({ className, videos: classVideos }, index) => (
            <Link href={`/class/${encodeURIComponent(className)}`} className={`class-card ${CLASS_COLORS[index]}`} key={className}>
              <div className="class-folder"><FolderIcon /></div>
              <div className="class-card-content">
                <h3>{className}</h3>
                <p><span className="book-icon" aria-hidden="true">▣</span>{classVideos.length} {classVideos.length === 1 ? 'Course' : 'Courses'}</p>
              </div>
              <span className="class-arrow"><ArrowIcon /></span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
