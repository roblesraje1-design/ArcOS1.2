'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen w-screen flex-col items-center justify-center bg-black text-white font-sans m-0 p-0 overflow-hidden">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2 text-red-500">Fatal Kernel Panic</h2>
          <p className="text-zinc-500 mb-6 font-mono text-xs max-w-md mx-auto">
            {error.message || "A fatal exception halted the root layout execution stream."}
          </p>
          <button
            onClick={() => reset()}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-lg text-xs transition-all cursor-pointer"
          >
            Hard Reboot Layout
          </button>
        </div>
      </body>
    </html>
  );
}
