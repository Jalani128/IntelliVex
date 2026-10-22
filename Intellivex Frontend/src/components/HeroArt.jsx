import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import checkArt from "../assets/hero-check.png";
import cube1 from "../assets/hero-cubes/cube-1.png";
import cube2 from "../assets/hero-cubes/cube-2.png";
import cube3 from "../assets/hero-cubes/cube-3.png";
import cube4 from "../assets/hero-cubes/cube-4.png";
import cube5 from "../assets/hero-cubes/cube-5.png";
import cube6 from "../assets/hero-cubes/cube-6.png";
import cube7 from "../assets/hero-cubes/cube-7.png";
import cube8 from "../assets/hero-cubes/cube-8.png";

/*
 * The hero artwork (assets/hero.png, 436 × 415) split into layers: the check mark
 * (with the two cubes fused to its arm) and each loose cube cut out at its exact
 * spot. Assembled, the layers are pixel-for-pixel the original image.
 * Boxes are in the original image's pixels.
 */
const ART = { w: 436, h: 415 };
const CUBES = [
  { src: cube1, x: 24, y: 72, w: 35, h: 32 },
  { src: cube2, x: 63, y: 88, w: 33, h: 28 },
  { src: cube3, x: 24, y: 115, w: 46, h: 49 },
  { src: cube4, x: 67, y: 124, w: 23, h: 19 },
  { src: cube5, x: 60, y: 147, w: 58, h: 48 },
  { src: cube6, x: 44, y: 170, w: 31, h: 25 },
  { src: cube7, x: 126, y: 179, w: 48, h: 39 },
  { src: cube8, x: 70, y: 198, w: 77, h: 59 },
];
const pct = (v, of) => `${(v / of) * 100}%`;

/**
 * Hero artwork with a GSAP build-in: the check mark settles in, then the small cubes
 * fly in from the left one after another — nearest the check first — and lock into
 * place to complete the picture. Once built, each cube drifts gently on its own.
 * Visitors who prefer reduced motion get the finished picture straight away.
 */
export default function HeroArt({ className = "" }) {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const ctx = gsap.context(() => {
      const cubes = gsap.utils.toArray("[data-cube]");
      // Build order: the cubes closest to the check mark land first, the far ones last.
      const order = [...cubes].sort((a, b) => Number(b.dataset.reach) - Number(a.dataset.reach));
      const width = root.current.offsetWidth;

      const tl = gsap.timeline({ delay: 0.25 });
      tl.from("[data-check]", { opacity: 0, scale: 0.88, x: 30, duration: 0.9, ease: "power3.out", transformOrigin: "60% 60%" })
        .from(
          order,
          {
            opacity: 0,
            x: () => -gsap.utils.random(0.35, 0.6) * width,
            y: () => gsap.utils.random(-0.18, 0.18) * width,
            rotation: () => gsap.utils.random(-120, 120),
            scale: () => gsap.utils.random(0.2, 0.5),
            duration: 0.9,
            ease: "back.out(1.7)",
            stagger: 0.11,
          },
          "-=0.35",
        )
        // A quick shimmer across the finished picture.
        .fromTo(order, { filter: "brightness(1.6)" }, { filter: "brightness(1)", duration: 0.6, stagger: 0.04, ease: "power2.out" }, "-=0.2");

      // Idle: every cube floats a few pixels on its own clock.
      tl.add(() => {
        cubes.forEach((cube) => {
          gsap.to(cube, {
            y: () => gsap.utils.random(-6, 6),
            x: () => gsap.utils.random(-3, 3),
            rotation: () => gsap.utils.random(-3, 3),
            duration: () => gsap.utils.random(2.2, 3.6),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            repeatRefresh: true,
          });
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      className={`relative aspect-[436/415] select-none ${className}`}
      role="img"
      aria-label="Intellivex — strategic IT solutions"
    >
      <img data-check src={checkArt} alt="" aria-hidden="true" draggable="false" className="absolute inset-0 h-full w-full" />
      {CUBES.map((c) => (
        <img
          key={c.src}
          data-cube
          // How far right the cube sits (its right edge): higher = nearer the check mark.
          data-reach={c.x + c.w}
          src={c.src}
          alt=""
          aria-hidden="true"
          draggable="false"
          className="absolute will-change-transform"
          style={{ left: pct(c.x, ART.w), top: pct(c.y, ART.h), width: pct(c.w, ART.w), height: pct(c.h, ART.h) }}
        />
      ))}
    </div>
  );
}
