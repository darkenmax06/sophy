import { useEffect, useRef } from 'react';

interface MorphingTextProps {
  texts: string[];
  className?: string;
}

const MORPH_TIME = 1.5;
const COOLDOWN_TIME = 0.5;

export default function MorphingText({ texts, className = '' }: MorphingTextProps) {
  // Wrappers receive blur + opacity (not the gradient-clipped spans)
  // This prevents iOS Safari from hiding text when filter is applied to
  // an element with -webkit-text-fill-color: transparent / background-clip: text
  const wrap1Ref = useRef<HTMLSpanElement>(null);
  const wrap2Ref = useRef<HTMLSpanElement>(null);
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(COOLDOWN_TIME);
  const timeRef = useRef(Date.now());

  useEffect(() => {
    if (!texts || texts.length === 0) return;

    const setStyles = (fraction: number) => {
      const w1 = wrap1Ref.current;
      const w2 = wrap2Ref.current;
      if (!w1 || !w2) return;

      const inv = 1 - fraction;
      w1.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`;
      w1.style.opacity = `${Math.pow(inv, 0.4)}`;

      w2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      w2.style.opacity = `${Math.pow(fraction, 0.4)}`;

      if (text1Ref.current) text1Ref.current.textContent = texts[textIndexRef.current % texts.length];
      if (text2Ref.current) text2Ref.current.textContent = texts[(textIndexRef.current + 1) % texts.length];
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
      const w1 = wrap1Ref.current;
      const w2 = wrap2Ref.current;
      if (w1 && w2) {
        w2.style.filter = 'none';
        w2.style.opacity = '1';
        w1.style.filter = 'none';
        w1.style.opacity = '0';
      }
    };

    // Init
    if (text1Ref.current) text1Ref.current.textContent = texts[0];
    if (text2Ref.current) text2Ref.current.textContent = texts[1] ?? texts[0];
    if (wrap1Ref.current) { wrap1Ref.current.style.opacity = '1'; wrap1Ref.current.style.filter = 'none'; }
    if (wrap2Ref.current) { wrap2Ref.current.style.opacity = '0'; wrap2Ref.current.style.filter = 'none'; }

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
      {/* SVG filter for desktop threshold morphing — disabled on mobile via CSS (filter: none) */}
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
        {/* Each wrapper receives blur/opacity; inner span holds gradient-clipped text */}
        <span ref={wrap1Ref} className="morphing-text-wrap">
          <span ref={text1Ref} className="morphing-text-span" />
        </span>
        <span ref={wrap2Ref} className="morphing-text-wrap">
          <span ref={text2Ref} className="morphing-text-span" />
        </span>
      </span>
    </>
  );
}
