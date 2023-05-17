import { createEffect, createSignal, onCleanup, JSXElement } from 'solid-js';

interface HorizontalLockProps {
  children: JSXElement;
}

const HorizontalLock = ({ children }: HorizontalLockProps) => {
  const [scrollLocked, setScrollLocked] = createSignal(false);

  // Event listener to handle scroll and lock/unlock the gallery component
  const handleScroll = () => {
    const gallery = document.getElementById('gallery');
    const { top, height } = gallery?.getBoundingClientRect() || {};
    const middle = window.innerHeight / 2;

    if (
      gallery &&
      !scrollLocked() &&
      top &&
      height &&
      top <= middle &&
      top + height >= middle
    ) {
      setScrollLocked(true);
      document.body.style.overflow = 'hidden';
      window.addEventListener('wheel', handleGalleryScroll, { passive: false });
    } else if (scrollLocked()) {
      setScrollLocked(false);
      document.body.style.overflow = 'auto';
      window.removeEventListener('wheel', handleGalleryScroll);
    }
  };

  // Event listener to handle horizontal scrolling of the gallery component
  const handleGalleryScroll = (event: WheelEvent) => {
    const gallery = document.getElementById('gallery');
    const { deltaY } = event;

    if (gallery) {
      const { scrollLeft, scrollWidth, clientWidth } = gallery;
      const isEndOfScroll = scrollLeft >= scrollWidth - clientWidth;
      const isBeginningOfScroll = scrollLeft === 0;

      if (
        (deltaY < 0 && isBeginningOfScroll) ||
        (deltaY > 0 && isEndOfScroll)
      ) {
        // Unlock scroll when reaching the beginning or end of horizontal scroll
        setScrollLocked(false);
        document.body.style.overflow = 'auto';
        window.removeEventListener('wheel', handleGalleryScroll);
      } else {
        // Prevent page scroll and perform horizontal scroll
        event.preventDefault();
        gallery.scrollLeft += deltaY;
      }
    }
  };

  // Attach and detach event listeners
  onCleanup(() => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('wheel', handleGalleryScroll);
  });

  // Attach event listener on component mount
  createEffect(() => {
    window.addEventListener('scroll', handleScroll);
  });

  return (
    <div
      id='gallery'
      style={{
        overflow: scrollLocked() ? 'hidden' : 'scroll',
        display: 'flex',
      }}
    >
      {children}
    </div>
  );
};

export default HorizontalLock;
