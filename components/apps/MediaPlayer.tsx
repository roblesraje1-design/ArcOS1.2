'use client';

export default function MediaPlayer({ appProps }: { appProps?: any }) {
  if (!appProps || !appProps.url) {
    return <div className="flex h-full items-center justify-center text-zinc-500">No Media Specified</div>;
  }

  const isAudio = appProps.type?.startsWith('audio/');

  return (
    <div className="flex h-full w-full flex-col bg-black/95 items-center justify-center p-6 relative">
        {isAudio ? (
            <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
                <div className="w-32 h-32 rounded-full border-4 border-blue-500/30 flex items-center justify-center bg-zinc-950 animate-[spin_10s_linear_infinite]">
                     <div className="w-8 h-8 rounded-full bg-blue-500/50"></div>
                </div>
                <div className="text-center space-y-1">
                    <h2 className="text-white font-medium text-lg truncate w-64">{appProps.name}</h2>
                    <p className="text-zinc-500 text-sm">Now Playing</p>
                </div>
                <audio controls autoPlay src={appProps.url} className="w-full h-12" />
            </div>
        ) : (
            <video controls autoPlay src={appProps.url} className="w-full h-full object-contain rounded-lg drop-shadow-2xl" />
        )}
    </div>
  );
}
