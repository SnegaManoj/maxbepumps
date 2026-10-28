import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { Sparkles } from 'lucide-react';

interface ShowcaseItem {
  id: string;
  category: string;
  title: string;
  image: string;
  slug: string;
  disclaimer?: string;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'centrifugal',
    category: 'Centrifugal Pumps',
    title: 'Centrifugal Pumps',
    image: '/images/centrifugal-pump.jpg',
    slug: 'centrifugal-pumps',
  },
  {
    id: 'submersible',
    category: 'Borewell Submersible Pumps',
    title: 'Submersible Pumps',
    image: '/images/submersible-pump.jpg',
    slug: 'borewell-submersible-pumps',
  },
  {
    id: 'monoblock',
    category: 'Monoblock Pumps',
    title: 'Monoblock Pumps',
    image: '/images/monoblock-pump.jpg',
    slug: 'monoblock-pumps',
  },
  {
    id: 'low-voltage',
    category: 'Low-Voltage Pumps',
    title: 'Low-Voltage Pumps',
    image: '/images/low-voltage-pump.jpg',
    slug: 'low-voltage-pumps',
  },
  {
    id: 'solar',
    category: 'Solar Pumps',
    title: 'Solar Pumps',
    image: '/images/low-voltage-pump.jpg',
    slug: 'solar-pumps',
    disclaimer: 'Generic sample only; solar model photo is unverified.',
  },
  {
    id: 'self-priming',
    category: 'Self-Priming Pumps',
    title: 'Self-Priming Pumps',
    image: '/images/self-priming-pump.jpg',
    slug: 'self-priming-pumps',
  },
];

export function ForwardProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(media.matches);
    const update = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isPaused || reduceMotion) return;
    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SHOWCASE_ITEMS.length);
    }, 4000);
    return () => window.clearInterval(interval);
  }, [isPaused, reduceMotion]);

  const goTo = (index: number) => {
    setCurrentIndex((index + SHOWCASE_ITEMS.length) % SHOWCASE_ITEMS.length);
  };

  return (
    <section
      ref={sectionRef}
      className={`forward-showcase-section${isInView ? ' is-in-view' : ''}`}
      aria-label="Illustrative sample pump images"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsPaused(false);
      }}
      onTouchStart={(e) => {
        touchStart.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return;
        const diff = (e.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
        if (Math.abs(diff) > 40) {
          goTo(currentIndex + (diff < 0 ? 1 : -1));
        }
        touchStart.current = null;
      }}
    >
      <div className="container">
        <div className="forward-showcase-header">
          <div className="forward-showcase-kicker">
            <Sparkles size={14} className="kicker-icon" />
            <span>SAMPLE PUMP IMAGES</span>
          </div>
          <h2>Explore pump categories</h2>
          <p>Explore illustrative pump forms and browse the matching categories.</p>
        </div>

        <div className="forward-3d-stage">
          <div className="forward-3d-deck">
            {SHOWCASE_ITEMS.map((item, idx) => {
              const offset = (idx - currentIndex + SHOWCASE_ITEMS.length) % SHOWCASE_ITEMS.length;
              // Map relative positions: 0 = center (front), 1 = next (right), length-1 = prev (left)
              const roleClass = offset === 0 ? 'card-front' : 'card-hidden';

              const isFront = offset === 0;

              return (
                <div
                  key={item.id}
                  className={`forward-card ${roleClass}`}
                  onClick={() => !isFront && goTo(idx)}
                  role={isFront ? 'group' : 'button'}
                  aria-label={isFront ? item.category : `View ${item.category}`}
                  tabIndex={isFront ? 0 : -1}
                >
                  <div className="forward-card-inner">
                    <div className="forward-card-media">
                      <img
                        key={isFront ? `active-${currentIndex}` : item.id}
                        src={item.image}
                        alt={`Illustrative sample image of a pump for ${item.category}`}
                        className="forward-card-img sample-pump-image"
                        loading={isFront ? 'eager' : 'lazy'}
                      />
                      <span className="forward-image-watermark" aria-hidden="true">SAMPLE IMAGE</span>
                    </div>

                    <div className="forward-card-body">
                      <p className="sample-image-disclaimer">{item.disclaimer ?? 'Illustrative sample; not an official MAXBE product photo.'}</p>
                      <h3>{item.title}</h3>

                      <div className="forward-card-actions">
                        <Link href={`/products/${item.slug}`} className="btn">
                          View Category
                        </Link>
                        <Link href={`/contact?category=${item.slug}`} className="btn outline">
                          Get Quote
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="forward-controls-bar">
            <div className="forward-dots-bar" role="tablist" aria-label="Select pump">
              {SHOWCASE_ITEMS.map((item, idx) => (
                <button
                  type="button"
                  key={item.id}
                  className={`forward-dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={() => goTo(idx)}
                  aria-label={`Go to slide ${idx + 1}: ${item.category}`}
                  aria-selected={idx === currentIndex}
                  role="tab"
                />
              ))}
            </div>

          </div>
        </div>

        {/* Quick-Access Pills */}
        <div className="forward-pills-row">
          {SHOWCASE_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              className={`forward-pill ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => goTo(idx)}
            >
              <span>{item.category}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

