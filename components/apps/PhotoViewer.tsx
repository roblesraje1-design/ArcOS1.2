'use client';

export default function PhotoViewer({ appProps }: { appProps?: any }) {
  if (!appProps || !appProps.url) {
    return <div className="flex h-full items-center justify-center text-zinc-500">No Image Specified</div>;
  }

  return (
    <div className="flex h-full items-center justify-center bg-black/90 p-4">
      <img src={appProps.url} alt={appProps.name || 'Photo Viewer'} className="max-h-full max-w-full object-contain drop-shadow-2xl" />
    </div>
  );
}
