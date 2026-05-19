'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("System core exception:", error);
  }, [error]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-black text-white font-sans">
      <h2 className="text-xl font-bold mb-2">System Core Exception</h2>
      <p className="text-zinc-500 mb-6 font-mono text-xs">
        {error.message || "An unhandled kernel panic occurred in the system runspace."}
      </p>
      <button
        onClick={() => reset()}
        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg text-xs transition-all cursor-pointer"
      >
        Restart Core Synapse
      </button>
    </div>
  );
}
