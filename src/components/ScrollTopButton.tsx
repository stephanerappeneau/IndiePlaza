import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-36 w-12 h-12 border bg-white border-gray-200 right-4 flex justify-center items-center rounded-full shadow-lg font-bold z-20"
          title="Scroll to Top"
        >
          <Image
            src="/assets/scrollTop.svg"
            alt="Scroll Icon"
            role="button"
            width={25}
            height={25}
          />
        </button>
      )}
    </div>
  );
};

export default ScrollToTop;
