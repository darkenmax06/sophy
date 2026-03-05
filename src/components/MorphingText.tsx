import { useEffect, useRef } from 'react';

interface MorphingTextProps {
  texts: string[];
  className?: string;
}

const MORPH_TIME = 1.5;
const COOLDOWN_TIME = 0.5;

export default function MorphingText({ texts, className = '' }: MorphingTextProps) {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(COOLDOWN_TIME);
  const timeRef = useRef(Date.now());

  useEffect(() => {
    if (!texts || texts.length === 0) return;

    const setStyles = (fraction: number) => {
      const el1 = text1Ref.current;
      const el2 = text2Ref.current;
      if (!el1 || !el2) return;

      // fading out el1, fading in el2
      const inv = 1 - fraction;
      el1.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`;
      el1.style.opacity = `${Math.pow(inv, 0.4)}`;

      el2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      el2.style.opacity = `${Math.pow(fraction, 0.4)}`;

      el1.textContent = texts[textIndexRef.current % texts.length];
      el2.textContent = texts[(textIndexRef.current + 1) % texts.length];
    };

    const doMorph = () => {
      morphRef.current -= cooldownRef.current;
      cooldownRef.current = 0;

      let fraction = morphRef.current / MORPH_TIME;
      if (fraction > 1) {
        cooldownRef.current = COOLDOWN_TIME;
        fraction = 1;
      }

      setStyles(fraction);

      if (fraction === 1) {
        textIndexRef.current = (textIndexRef.current + 1) % texts.length;
      }
    };

    const doCooldown = () => {
      morphRef.current = 0;
      const el1 = text1Ref.current;
      const el2 = text2Ref.current;
      if (el1 && el2) {
        el2.style.filter = 'none';
        el2.style.opacity = '1';
        el1.style.filter = 'none';
        el1.style.opacity = '0';
      }
    };

    // Init
    if (text1Ref.current) text1Ref.current.textContent = texts[0];
    if (text2Ref.current) text2Ref.current.textContent = texts[1] ?? texts[0];

    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const now = Date.now();
      const dt = (now - timeRef.current) / 1000;
      timeRef.current = now;

      cooldownRef.current -= dt;
      if (cooldownRef.current <= 0) doMorph();
      else doCooldown();
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [texts]);

  return (
    <>
      {/* SVG filter for the threshold morphing effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="morphing-threshold">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"
              result="output"
            />
          </filter>
        </defs>
      </svg>
      <span className={`morphing-text-container ${className}`}>
        <span ref={text1Ref} className="morphing-text-span" />
        <span ref={text2Ref} className="morphing-text-span" />
      </span>
    </>
  );
}
