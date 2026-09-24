import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllVideos } from '@/lib/videos';

const CLASS_LEVELS = ['Class IX', 'Class X', 'Class XI', 'Class XII'];

function normalizeClassName(value: string) {
  return decodeURIComponent(value).replace(/[-_]+/g, ' ').trim().toLowerCase();
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
    <main className="page-shell class-page">
      <header className="edu-header">
        <div className="edu-header-inner">
          <Link href="/" className="edu4all-title">Edu4all</Link>
        </div>
      </header>

      <section className="class-page-section">
        <div className="container">
          <div className="class-page-heading">
            <Link href="/" className="back-link">← All classes</Link>
            <h1>{className}</h1>
            <p>{videos.length} {videos.length === 1 ? 'course' : 'courses'} available</p>
          </div>

          {videos.length === 0 ? (
            <div className="empty-state">
              <h2>No courses found</h2>
              <p>Add published videos with <strong>{className}</strong> in the Google Sheet&apos;s grade_level column.</p>
            </div>
          ) : (
            <div className="class-video-list">
              {videos.map((video) => (
                <Link href={`/watch/${video.slug}`} className="class-video-card" key={video.id}>
                  <div className="class-video-thumb">
                    <img
                      src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                      alt={video.title}
                    />
                  </div>
                  <div className="class-video-content">
                    <span className="tag">{video.subject}</span>
                    <h2>{video.title}</h2>
                    <p>{video.description}</p>
                    <div className="meta-row">
                      <span>{video.instructor}</span>
                      <span>{video.duration}</span>
                    </div>
                  </div>
                  <span className="class-arrow" aria-hidden="true">›</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
