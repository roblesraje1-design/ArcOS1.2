export const dynamic = 'force-dynamic';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-black text-white font-sans">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-zinc-500 mb-6 font-mono text-xs">Route not initialized on this system core.</p>
      <Link href="/" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg text-xs transition-all">
        Return to Desktop
      </Link>
    </div>
  );
}
