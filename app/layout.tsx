import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Remix: WebOS 1.0',
  description: 'A macOS-inspired web operating system with top Menu Bar, hybrid Control Center, AI-powered Spotlight search, auto-hiding Dock, full-screen apps, AI assistant, and customizable System Settings.',
  openGraph: {
    title: 'Remix: WebOS 1.0',
    description: 'A macOS-inspired web operating system with top Menu Bar, hybrid Control Center, AI-powered Spotlight search, auto-hiding Dock, full-screen apps, AI assistant, and customizable System Settings.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
