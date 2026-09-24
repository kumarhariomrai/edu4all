import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllVideos, getVideoBySlug } from '@/lib/videos';

export default async function VideoPage({ params }: { params: { slug: string } }) {
  const video = await getVideoBySlug(params.slug);

  if (!video) {
    notFound();
  }

  return (
    <main className="page-shell narrow-page">
      <header className="topbar">
        <div className="container navbar">
          <Link href="/" className="brand">Education4all</Link>
        </div>
      </header>

      <section className="section">
        <div className="container video-page">
          <div className="video-player-wrap">
            <iframe
              src={`https://www.youtube.com/embed/${video.youtube_id}?rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="video-info">
            <span className="tag">{video.subject}</span>
            <h1>{video.title}</h1>
            <div className="meta-row detail-meta">
              <span>{video.grade_level}</span>
              <span>{video.duration}</span>
              <span>{video.topic}</span>
            </div>
            <p className="description">{video.description}</p>
            <div className="meta-list">
              <div>
                <span className="label">Instructor</span>
                <strong>{video.instructor}</strong>
              </div>
              <div>
                <span className="label">Language</span>
                <strong>{video.language}</strong>
              </div>
              <div>
                <span className="label">Published</span>
                <strong>{video.published_date || 'N/A'}</strong>
              </div>
            </div>

            <div className="back-link-row">
              <Link href="/" className="secondary-btn">← Back to library</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
