import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const DEFAULT_DURATION_MS = 5000;

const normalizeStories = (stories) => {
  if (!Array.isArray(stories)) return [];
  return stories
    .filter(Boolean)
    .map((item) => (typeof item === 'string' ? { src: item, alt: 'Offer' } : item))
    .filter((item) => item && typeof item.src === 'string' && item.src.length > 0);
};

const OffersStoriesViewer = ({ onBack, stories, durationMs = DEFAULT_DURATION_MS }) => {
  const normalizedStories = useMemo(() => normalizeStories(stories), [stories]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeProgress, setActiveProgress] = useState(0); // 0..1
  const [activeLoaded, setActiveLoaded] = useState(false);
  const [activeError, setActiveError] = useState(false);
  const [failedIndices, setFailedIndices] = useState(() => new Set());
  const [allFailed, setAllFailed] = useState(false);

  const closingRef = useRef(false);
  const rafRef = useRef(null);
  const startTimeRef = useRef(0);

  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    onBack?.();
  }, [onBack]);

  const findNextIndex = useCallback(
    (fromIndex) => {
      if (normalizedStories.length === 0) return -1;
      for (let i = fromIndex + 1; i < normalizedStories.length; i += 1) {
        if (!failedIndices.has(i)) return i;
      }
      return -1;
    },
    [failedIndices, normalizedStories.length]
  );

  const findPrevIndex = useCallback(
    (fromIndex) => {
      if (normalizedStories.length === 0) return -1;
      for (let i = fromIndex - 1; i >= 0; i -= 1) {
        if (!failedIndices.has(i)) return i;
      }
      return -1;
    },
    [failedIndices, normalizedStories.length]
  );

  const goNext = useCallback(() => {
    setActiveProgress(0);
    setActiveLoaded(false);
    setActiveError(false);

    setActiveIndex((prev) => {
      const next = findNextIndex(prev);
      if (next === -1) {
        if (prev >= normalizedStories.length - 1) queueMicrotask(() => close());
        return prev;
      }
      return next;
    });
  }, [close, normalizedStories.length]);

  const goPrev = useCallback(() => {
    setActiveProgress(0);
    setActiveLoaded(false);
    setActiveError(false);

    setActiveIndex((prev) => {
      const next = findPrevIndex(prev);
      return next === -1 ? prev : next;
    });
  }, [findPrevIndex]);

  useEffect(() => {
    setActiveProgress(0);
    setActiveLoaded(false);
    setActiveError(false);
  }, [activeIndex]);

  useEffect(() => {
    if (normalizedStories.length === 0) return;
    if (failedIndices.size === 0) {
      setAllFailed(false);
      return;
    }

    const isAllFailed = failedIndices.size >= normalizedStories.length;
    setAllFailed(isAllFailed);
  }, [failedIndices, normalizedStories.length]);

  useEffect(() => {
    if (normalizedStories.length === 0) return;
    if (allFailed) return;
    if (!activeLoaded) return;
    if (activeError) return;

    startTimeRef.current = performance.now();
    setActiveProgress(0);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const tick = (now) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(1, elapsed / durationMs);
      setActiveProgress(progress);

      if (progress >= 1) {
        goNext();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [activeError, activeIndex, activeLoaded, allFailed, durationMs, goNext, normalizedStories.length]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [close, goNext, goPrev]);

  const activeStory = normalizedStories[activeIndex];

  const handleImageLoad = useCallback(() => {
    setActiveLoaded(true);
    setActiveError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setActiveLoaded(true);
    setActiveError(true);

    setFailedIndices((prev) => {
      const next = new Set(prev);
      next.add(activeIndex);
      return next;
    });

    // Try to auto-skip to the next valid image. If none exist, show the fallback view.
    const nextIndex = findNextIndex(activeIndex);
    if (nextIndex !== -1) {
      setActiveIndex(nextIndex);
      setActiveProgress(0);
      setActiveLoaded(false);
      setActiveError(false);
    }
  }, [activeIndex, findNextIndex]);

  if (normalizedStories.length === 0 || allFailed) {
    return (
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-50 bg-brand-dark/95 backdrop-blur-xl overflow-hidden"
      >
        <button
          onClick={close}
          className="absolute top-4 left-4 p-3 rounded-full bg-brand-dark/50 hover:bg-brand-dark/70 backdrop-blur-md border border-brand-light/20 text-brand-light transition-all z-20 shadow-lg"
          aria-label="Close offers"
        >
          <X size={24} />
        </button>

        <div className="w-full h-full flex items-center justify-center px-8 text-center">
          <p className="text-white/80 text-sm font-light">
            No offer images found (or they failed to load). Add images under <span className="font-medium">public/offers</span> and update
            <span className="font-medium"> src/data/offers.js</span>.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-brand-dark/95 backdrop-blur-xl overflow-hidden"
    >
      {/* Progress Segments */}
      <div className="absolute top-0 left-0 right-0 px-3 pt-3 z-20">
        <div className="flex gap-1">
          {normalizedStories.map((_, idx) => {
            const fillPct =
              idx < activeIndex ? 100 : idx > activeIndex ? 0 : Math.round(activeProgress * 100);

            return (
              <div key={idx} className="h-1 flex-1 rounded bg-white/20 overflow-hidden">
                <div className="h-full bg-white/80" style={{ width: `${fillPct}%` }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={close}
        className="absolute top-4 right-4 p-3 rounded-full bg-brand-dark/50 hover:bg-brand-dark/70 backdrop-blur-md border border-brand-light/20 text-brand-light transition-all z-20 shadow-lg"
        aria-label="Close offers"
      >
        <X size={24} />
      </button>

      {/* Tap Areas */}
      <button
        type="button"
        onClick={goPrev}
        className="absolute inset-y-0 left-0 w-1/2 z-10"
        aria-label="Previous offer"
      />
      <button
        type="button"
        onClick={goNext}
        className="absolute inset-y-0 right-0 w-1/2 z-10"
        aria-label="Next offer"
      />

      {/* Story Content */}
      <div className="w-full h-full flex items-center justify-center px-6">
        <img
          src={activeStory.src}
          alt={activeStory.alt || `Offer ${activeIndex + 1}`}
          className="max-w-full max-h-full object-contain select-none"
          draggable={false}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {activeError && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-brand-dark/60 backdrop-blur-md border border-brand-light/20 text-white/80 text-xs">
            Failed to load this offer image. Tap right to skip.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OffersStoriesViewer;
