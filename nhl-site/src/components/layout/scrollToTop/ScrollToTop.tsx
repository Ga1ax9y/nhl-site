import { useState, useEffect } from 'react';

type ScrollToTopProps = {
  container?: React.RefObject<HTMLElement>;
};

export default function ScrollToTop({ container }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const scrollContainer = container?.current;
    const handleScroll = () => {
      let scrollPosition = 0;

      if (container?.current) {
        scrollPosition = container.current.scrollTop;
      } else {
        scrollPosition = window.scrollY || window.pageYOffset;
      }

      if (scrollPosition > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
    }

    handleScroll();

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [container]);

  const scrollToTop = () => {
    if (container?.current) {
      container.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {isVisible && (
        <button
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 20L12 4M12 4L5 11M12 4L19 11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </>
  );
}
