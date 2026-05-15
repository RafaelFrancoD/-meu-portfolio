import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, delay = 0 }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const element = sectionRef.current;
    if (!element) return;

    const items = element.querySelectorAll('[data-gsap-item]');

    const ctx = gsap.context(() => {
      gsap.set(element, { autoAlpha: 0, y: 40 });
      gsap.set(items, { autoAlpha: 0, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: 'top 82%',
          once: true,
        },
        delay: delay / 1000,
      });

      tl.to(element, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
      }).to(
        items,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
        },
        '-=0.45'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={sectionRef} className="will-change-transform">
      {children}
    </div>
  );
};

export default AnimatedSection;
