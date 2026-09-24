import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Education4all',
  description: 'Academic educational videos for all learners.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
