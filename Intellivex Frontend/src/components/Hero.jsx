import { motion, useReducedMotion } from "framer-motion";
import Button from "./Button";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import DecorSquares from "./DecorSquares";
import ExperienceBadge from "./ExperienceBadge";
import { HERO } from "../data/home";
import heroArt from "../assets/hero.png";

/* Tile clusters scattered around the hero, each drifting on its own clock.
   On narrow screens they shift outward so they never sit under the copy. */
const HERO_SHAPES = [
  { className: "left-[3%] top-[26%]", size: 82, drift: 16, duration: 8 },
  { className: "left-[80%] top-[40%] lg:left-[63%] lg:top-[53%]", size: 82, drift: 18, duration: 9, delay: 1.2 },
  { className: "left-[2%] top-[60%] lg:left-[88%] lg:top-[64%]", size: 82, drift: 14, duration: 12, delay: 0.6 },
];

export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <section id="home" className="relative overflow-hidden bg-navy bg-hero-glow">
      <DecorSquares shapes={HERO_SHAPES} />

      <div className="container-narrow relative pb-14 pt-32 md:pb-20 md:pt-40 lg:pb-[60px] lg:pt-[210px]">
        {/* On desktop the artwork is pinned to the right and overlaps the
            heading column, exactly as it does in the Figma frame. */}
        <div className="relative">
          {/* Copy */}
          <div className="relative z-10 text-center lg:max-w-[706px] lg:text-left">
            <Reveal y={20}>
              <Eyebrow className="justify-center lg:justify-start">{HERO.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="mt-4 font-display text-[32px] font-medium leading-[1.22] text-white sm:text-[40px] lg:text-[52px]">
                {HERO.titleLine1}
                <br className="hidden lg:inline" /> {HERO.titleLine2}{" "}
                <span className="text-gradient">{HERO.highlight}</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mx-auto mt-5 max-w-[560px] font-body text-[15px] leading-[1.55] text-white/75 lg:mx-0">
                {HERO.description}
              </p>
            </Reveal>

            {/* Buttons and the stat plate share a row on desktop, as in Figma. */}
            <div className="mt-8 flex flex-col items-center gap-8 lg:flex-row lg:flex-nowrap lg:items-start lg:gap-0">
              <Reveal delay={0.3} className="shrink-0">
                <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                  <Button href="#contact" variant="light">
                    Get Started
                  </Button>
                  <Button href="#services" variant="primary">
                    Explore More
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={0.4} className="shrink-0 lg:ml-[164px] lg:mt-3.5">
                <ExperienceBadge value={HERO.stat.value} label={HERO.stat.label} />
              </Reveal>
            </div>
          </div>

          {/* Artwork */}
          <motion.div
            className="mt-10 flex justify-center lg:absolute lg:-right-[70px] lg:top-1/2 lg:mt-0 lg:w-[404px] lg:-translate-y-1/2"
            initial={{ opacity: 0, scale: 0.86, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <motion.img
              src={heroArt}
              alt="Intellivex — strategic IT solutions"
              className="w-[70%] max-w-[340px] drop-shadow-[0_30px_60px_rgba(6,86,243,0.45)] sm:w-[52%] lg:w-full lg:max-w-none"
              animate={reduced ? undefined : { y: [0, -18, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* Partner logos */}
        <Reveal delay={0.5}>
         <ul className="mx-auto mt-12 flex max-w-[1060px] items-center justify-between px-4 md:mt-16 md:px-0 lg:mt-[90px]">
  {HERO.logos.map((logo, i) => (
    <li key={i} className="flex items-center justify-center">
      <img
        src={logo.src}
        alt={logo.alt}
        className="
          h-8
          w-auto
          object-contain
          opacity-80
          transition-all
          duration-300
          hover:opacity-100
          md:h-6
          lg:h-7
        "
      />
    </li>
  ))}
</ul>
        </Reveal>
      </div>
    </section>
  );
}
