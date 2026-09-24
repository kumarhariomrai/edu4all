import { google } from 'googleapis';
import { Video } from '@/types/video';

const FALLBACK_VIDEOS: Video[] = [
  {
    id: 'sample-1',
    slug: 'introduction-to-algebra',
    title: 'Introduction to Algebra',
    description: 'Learn the foundations of algebra with clear examples and guided practice.',
    youtube_url: 'https://www.youtube.com/watch?v=0d1nD4h4J_0',
    youtube_id: '0d1nD4h4J_0',
    thumbnail_url: 'https://img.youtube.com/vi/0d1nD4h4J_0/hqdefault.jpg',
    subject: 'Mathematics',
    grade_level: 'Class 8',
    topic: 'Algebra Basics',
    instructor: 'Education4all Team',
    duration: '12:15',
    language: 'English',
    published: true,
    featured: true,
    display_order: '1',
    published_date: '2026-01-01',
  },
  {
    id: 'sample-2',
    slug: 'photosynthesis-explained',
    title: 'Photosynthesis Explained',
    description: 'Explore how plants convert sunlight into energy through the process of photosynthesis.',
    youtube_url: 'https://www.youtube.com/watch?v=Qj4lW8lKlQ8',
    youtube_id: 'Qj4lW8lKlQ8',
    thumbnail_url: 'https://img.youtube.com/vi/Qj4lW8lKlQ8/hqdefault.jpg',
    subject: 'Biology',
    grade_level: 'Class 7',
    topic: 'Plant Science',
    instructor: 'Education4all Team',
    duration: '9:42',
    language: 'English',
    published: true,
    featured: true,
    display_order: '2',
    published_date: '2026-01-02',
  },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'video';
}

function normalizeBoolean(value: string | undefined) {
  return String(value || '').trim().toUpperCase() === 'TRUE';
}

function extractYoutubeId(url: string) {
  if (!url) return '';
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/i,
    /youtube\.com\/embed\/([^?]+)/i,
    /youtu\.be\/([^?]+)/i,
    /youtube\.com\/shorts\/([^?]+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return url;
}

function mapRowToVideo(row: string[], headers: string[]) {
  const record: Record<string, string> = {};

  headers.forEach((header, index) => {
    record[header.trim()] = row[index]?.trim() || '';
  });

  const title = record.title || 'Untitled Video';
  const youtubeUrl = record.youtube_url || '';

  return {
    id: record.id || slugify(title),
    slug: slugify(record.title || title),
    title,
    description: record.description || 'Academic educational video lesson.',
    youtube_url: youtubeUrl,
    youtube_id: extractYoutubeId(youtubeUrl),
    thumbnail_url: record.thumbnail_url || `https://img.youtube.com/vi/${extractYoutubeId(youtubeUrl)}/hqdefault.jpg`,
    subject: record.subject || 'General',
    grade_level: record.grade_level || 'All Levels',
    topic: record.topic || 'General Topic',
    instructor: record.instructor || 'Education4all',
    duration: record.duration || 'N/A',
    language: record.language || 'English',
    published: normalizeBoolean(record.published),
    featured: normalizeBoolean(record.featured),
    display_order: record.display_order || '0',
    published_date: record.published_date || '',
  } satisfies Video;
}

async function getSheetVideos(): Promise<Video[]> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME || 'Videos';
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!sheetId || !serviceAccountEmail || !privateKey) {
    return FALLBACK_VIDEOS;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccountEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:Z`,
    });

    const rows = response.data.values || [];
    if (rows.length < 2) return FALLBACK_VIDEOS;

    const headers = rows[0].map((header) => String(header).trim());
    const dataRows = rows.slice(1).map((row) => mapRowToVideo(row, headers));

    return dataRows.filter((video) => video.published).sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0));
  } catch (error) {
    console.error('Error fetching Google Sheet data:', error);
    return FALLBACK_VIDEOS;
  }
}

export async function getAllVideos(): Promise<Video[]> {
  const videos = await getSheetVideos();
  return videos.filter((video) => video.published);
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  const videos = await getAllVideos();
  return videos.find((video) => video.slug === slug) || null;
}

export function getFeaturedVideos(videos: Video[]) {
  return videos.filter((video) => video.featured).slice(0, 3);
}

export function getSubjects(videos: Video[]) {
  return [...new Set(videos.map((video) => video.subject).filter(Boolean))];
}
