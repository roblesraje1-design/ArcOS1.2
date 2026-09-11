'use client';

import { useOSStore } from '@/store/useOSStore';
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
import GoogleDrive from './apps/GoogleDrive';
import Gmail from './apps/Gmail';
import GoogleMeet from './apps/GoogleMeet';
import GoogleKeep from './apps/GoogleKeep';
import Calculator from './apps/Calculator';
import IFrameAppMaker from './apps/IFrameAppMaker';
import IFrameViewer from './apps/IFrameViewer';
import Weather from './apps/Weather';
import GoogleDocs from './apps/GoogleDocs';
import GoogleSlides from './apps/GoogleSlides';
import GamesApp from './apps/GamesApp';

export default function WindowManager() {
  const { windows, customApps } = useOSStore();

  return (
    <div className="relative z-20">
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
            AppContent = <Settings defaultTab={win.appProps?.defaultTab} />;
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
          case 'drive':
            AppContent = <GoogleDrive />;
            break;
          case 'gmail':
            AppContent = <Gmail />;
            break;
          case 'meet':
            AppContent = <GoogleMeet />;
            break;
          case 'keep':
            AppContent = <GoogleKeep />;
            break;
          case 'calculator':
            AppContent = <Calculator />;
            break;
          case 'iframe':
            AppContent = <IFrameAppMaker />;
            break;
          case 'weather':
            AppContent = <Weather />;
            break;
          case 'docs':
            AppContent = <GoogleDocs appProps={win.appProps} />;
            break;
          case 'slides':
            AppContent = <GoogleSlides appProps={win.appProps} />;
            break;
          case 'games':
            AppContent = <GamesApp />;
            break;
          default:
            // Handle URL-based Web Apps / iFrames
            if (win.appProps?.url) {
              AppContent = <IFrameViewer url={win.appProps.url} title={win.title} />;
              break;
            }

            // Handle dynamically generated Sandbox Apps
            const customApp = customApps.find(a => a.id === win.appId);
            if (customApp) {
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

              const executionUrl = URL.createObjectURL(new Blob([finalHtml], { type: 'text/html' }));
              
              AppContent = (
                <iframe 
                  src={executionUrl} 
                  className="w-full h-full border-none bg-white font-sans"
                  sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups"
                />
              );
            }
            break;
        }

        return (
          <Window key={win.id} windowState={win}>
            {AppContent}
          </Window>
        );
      })}
    </div>
  );
}
