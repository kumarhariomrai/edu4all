import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllVideos } from '@/lib/videos';

const CLASS_LEVELS = ['Class IX', 'Class X', 'Class XI', 'Class XII'];

function normalizeClassName(value: string) {
  return decodeURIComponent(value).replace(/[-_]+/g, ' ').trim().toLowerCase();
}

function formatDate(iso: string) {
  if (!iso) return '01 Jul 2025';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '01 Jul 2025';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default async function ClassPage({
  params,
}: {
  params: { grade: string };
}) {
  const requestedClass = normalizeClassName(params.grade);
  const className = CLASS_LEVELS.find((level) => level.toLowerCase() === requestedClass);

  if (!className) notFound();

  const videos = (await getAllVideos()).filter(
    (video) => video.grade_level.trim().toLowerCase() === className.toLowerCase()
  );

  return (
    <main className="page-shell class-page-shell">
      <header className="edu-header">
        <div className="edu-header-inner">
          <Link href="/" className="edu4all-title">Edu4all</Link>
        </div>
      </header>

      <section className="class-page-section">
        <div className="container class-page-container">
          <div className="class-page-heading">
            <Link href="/" className="back-link">← All classes</Link>
            <h1>{className}</h1>
            <p>{videos.length} {videos.length === 1 ? 'course available' : 'courses available'}</p>
          </div>

          {videos.length === 0 ? (
            <div className="empty-state">
              <h2>No courses found</h2>
              <p>Add published videos with <strong>{className}</strong> in the Google Sheet&apos;s grade_level column.</p>
            </div>
          ) : (
            <div className="lesson-list">
              {videos.map((video, index) => (
                <Link href={`/watch/${video.slug}`} className="lesson-card" key={video.id}>
                  <div className="lesson-thumbnail-wrap">
                    <img
                      className="lesson-thumbnail"
                      src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                      alt={video.title}
                    />
                    <span className="thumbnail-play" aria-hidden="true">▶</span>
                    <span className="thumbnail-duration">{video.duration || 'Video'}</span>
                  </div>

                  <div className="lesson-content">
                    <h2>
                      <span>Class-{String(index + 1).padStart(2, '0')}</span>
                      <span> | </span>
                      <span>{video.title}</span>
                    </h2>
                    <p className="lesson-subject">{video.subject}</p>
                    <div className="lesson-date-box">
                      <span className="calendar-icon" aria-hidden="true">🗓</span>
                      <span>{formatDate(video.published_date)}</span>
                    </div>
                  </div>

                  <span className="lesson-watch" aria-hidden="true">Watch ›</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
