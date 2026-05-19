'use client';

import { useOSStore } from '@/store/useOSStore';
import { useMemo, useEffect } from 'react';
import Window from './Window';
import Browser from './apps/Browser';
import Settings from './apps/Settings';
import Terminal from './apps/Terminal';
import Files from './apps/Files';
import EOSLTranslator from './apps/EOSLTranslator';
import ARTechEngine from './apps/ARTechEngine';
import PhotoViewer from './apps/PhotoViewer';
import MediaPlayer from './apps/MediaPlayer';
import NeuralCore from './apps/NeuralCore';
import Tips from './apps/Tips';
import VanguardRestore from './apps/VanguardRestore';
import HyperX from './apps/HyperX';

interface CustomAppRunnerProps {
  customApp: { id: string, title: string, html: string, css: string, js: string };
}

function CustomAppRunner({ customApp }: CustomAppRunnerProps) {
  // Memoize creation of the Blob URL to prevent reloading iframe on outside state changes
  const executionUrl = useMemo(() => {
    const isFullHtml = customApp.html.toLowerCase().includes('<html');
    const finalHtml = isFullHtml 
      ? customApp.html 
      : `<html>
         <head><style>${customApp.css || ''}</style></head>
         <body>
           ${customApp.html}
           <script>window.ArcOS_Dispatch = window.parent.ArcOS_Dispatch; ${customApp.js || ''}</script>
         </body>
       </html>`;

    const blob = new Blob([finalHtml], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }, [customApp.html, customApp.css, customApp.js]);

  // Clean up Object URL to prevent memory leaks in state
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(executionUrl);
    };
  }, [executionUrl]);

  return (
    <iframe 
      src={executionUrl} 
      className="w-full h-full border-none bg-white font-sans"
      sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups"
    />
  );
}

export default function WindowManager() {
  const { windows, customApps } = useOSStore();

  return (
    <>
      {windows.map((win) => {
        if (win.isMinimized) return null;

        let AppContent = null;
        
        // Handle native apps
        switch (win.appId) {
          case 'tips':
            AppContent = <Tips />;
            break;
          case 'browser':
            AppContent = <Browser />;
            break;
          case 'settings':
            AppContent = <Settings />;
            break;
          case 'terminal':
            AppContent = <Terminal />;
            break;
          case 'files':
            AppContent = <Files />;
            break;
          case 'eosl':
            AppContent = <EOSLTranslator />;
            break;
          case 'devstudio':
            AppContent = <ARTechEngine />;
            break;
          case 'photoviewer':
            AppContent = <PhotoViewer appProps={win.appProps} />;
            break;
          case 'mediaplayer':
            AppContent = <MediaPlayer appProps={win.appProps} />;
            break;
          case 'neuralcore':
            AppContent = <NeuralCore />;
            break;
          case 'vanguard':
          case 'vanguard_restore':
            AppContent = <VanguardRestore />;
            break;
          case 'hyperx':
            AppContent = <HyperX />;
            break;
          default:
            // Handle dynamically generated Sandbox Apps
            const customApp = customApps.find(a => a.id === win.appId);
            if (customApp) {
              AppContent = <CustomAppRunner customApp={customApp} />;
            }
            break;
        }

        return (
          <Window key={win.id} windowState={win}>
            {AppContent}
          </Window>
        );
      })}
    </>
  );
}

