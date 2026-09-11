'use client';

export const dynamic = 'force-dynamic';

import dynamicHelper from 'next/dynamic';
import { useOSStore } from '@/store/useOSStore';

const BootScreen = dynamicHelper(() => import('@/components/BootScreen').then((m) => m.BootScreen), { ssr: false });
const Desktop = dynamicHelper(() => import('@/components/Desktop'), { ssr: false });
const OOBEScreen = dynamicHelper(() => import('@/components/OOBEScreen'), { ssr: false });

export default function Home() {
  const isBooting = useOSStore((state) => state.isBooting);
  const isOOBECompleted = useOSStore((state) => state.systemState.isOOBECompleted);

  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      {isBooting ? (
        <BootScreen />
      ) : !isOOBECompleted ? (
        <OOBEScreen />
      ) : (
        <Desktop />
      )}
    </main>
  );
}
