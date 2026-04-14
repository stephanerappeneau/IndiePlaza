import React, { useRef, useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout/AppLayout';

const GAME_URL = 'https://publisher-quest-game.web.app';

const path = [
  { label: 'Publisher Quest', href: '/tools/publisher-quest/', last: false },
];

const PublisherQuest = () => {
  const iframeRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);

  const enterFullScreen = () => {
    if (iframeRef.current) {
      iframeRef.current
        .requestFullscreen()
        .then(() => {
          setIsFullScreen(true);
          const orientation = screen.orientation as any;
          if (isMobile() && orientation.lock) {
            orientation.lock('landscape').catch(() => {});
          }
        })
        .catch(() => {});
    }
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      enterFullScreen();
    } else {
      document.exitFullscreen().then(() => setIsFullScreen(false));
    }
  };

  useEffect(() => {
    const handleChange = () => {
      setIsFullScreen(document.fullscreenElement === iframeRef.current);
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  return (
    <AppLayout
      title="Publisher Quest"
      description="Publisher Quest game to simulate an interview with a publisher"
      path={path}
    >
      <div className="h-screen w-full flex flex-col items-center bg-gray-100 p-4">
        <div
          ref={iframeRef}
          className="relative border-4 border-gray-800 rounded-lg overflow-hidden shadow-lg w-full h-3/6 md:h-5/6 flex flex-col items-center"
        >
          <button
            onClick={toggleFullScreen}
            className="absolute top-4 right-4 px-4 py-2 bg-red-studio text-white rounded shadow hover:bg-dark-red-studio z-10"
          >
            {isFullScreen ? 'Exit Full Screen' : 'Go Full Screen'}
          </button>
          <iframe
            src={GAME_URL}
            className="w-full h-full border-none"
            title="Publisher Quest"
            scrolling="no"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default PublisherQuest;
