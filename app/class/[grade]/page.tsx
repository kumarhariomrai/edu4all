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

  const cards = videos.length > 0 ? videos : [];

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
            <p>
              {cards.length} {cards.length === 1 ? 'course available' : 'courses available'}
            </p>
          </div>

          {cards.length === 0 ? (
            <div className="empty-state">
              <h2>No courses found</h2>
              <p>Add published videos with <strong>{className}</strong> in the Google Sheet&apos;s grade_level column.</p>
            </div>
          ) : (
            <div className="lesson-list">
              {cards.map((video, index) => {
                const lessonTitle = video.title || `Class-${index + 1}`;
                const displayTitle = lessonTitle.length > 30 ? `${lessonTitle.slice(0, 30)}...` : lessonTitle;
                const lessonDate = formatDate(video.published_date || '2025-07-01');

                return (
                  <article className="lesson-card" key={video.id}>
                    <div className="lesson-badge-box">
                      <div className="badge-mini">
                        <span className="badge-mark">M</span>
                      </div>

                      <div className="badge-text-wrap">
                        <div className="badge-topline">NAAM TŌ SUNA HŌGA</div>
                        <div className="badge-name">ABHI<span className="badge-glow">☺</span></div>
                        <div className="badge-meta">
                          <span>#MadXABhi</span>
                          <span>@MrYuv</span>
                        </div>
                        <div className="badge-time">{video.duration || '01:44:36'}</div>
                      </div>
                    </div>

                    <div className="lesson-content">
                      <h2>
                        <span className="lesson-number">Class-{String(index + 1).padStart(2, '0')}</span>
                        <span className="lesson-divider"> | </span>
                        <span>{displayTitle}</span>
                      </h2>
                    </div>

                    <div className="lesson-date-box">
                      <span className="calendar-icon" aria-hidden="true">🗓</span>
                      <span>{lessonDate}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
