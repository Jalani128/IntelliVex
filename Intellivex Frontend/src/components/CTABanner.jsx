import { motion } from "framer-motion";
import Button from "./Button";
import Reveal from "./Reveal";
import DecorSquares from "./DecorSquares";
import { CTA } from "../data/home";
import mockup from "../assets/cta-mockup.png";

const SHAPES = [
  { className: "left-[5%] top-[22%]", size: 82, drift: 14, duration: 9 },
  { className: "right-[5%] top-[22%]", size: 82, drift: 13, duration: 10, delay: 1 },
];

export default function CTABanner({ content = CTA }) {
  return (
    <section id="contact" className="relative bg-navy py-16 md:py-20 lg:py-[104px]">
      <div className="relative bg-gradient-to-r from-accent-deep via-accent to-accent">
        <DecorSquares shapes={SHAPES} />

        <div className="container-narrow relative grid items-center gap-10 py-12 lg:grid-cols-[1fr_420px] lg:gap-0 lg:py-8">
          {/* Device mockup — overflows the band top and bottom on desktop */}
          <div className="relative flex justify-center lg:block lg:self-stretch">
            <motion.img
              src={mockup}
              alt="Intellivex platform on tablet"
              className="w-full max-w-[420px] drop-shadow-[0_24px_50px_rgba(0,0,0,0.35)] lg:absolute lg:-top-[97px] lg:left-[59px] lg:w-[461px] lg:max-w-none"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {/* Copy */}
          <div>
            <Reveal>
              <h2 className="max-w-[340px] font-display text-[24px] font-semibold leading-[1.25] text-white sm:text-[26px]">
                {content.titleLine1}
                <br className="hidden sm:inline" /> {content.titleLine2}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-3 max-w-[400px] font-body text-[14px] leading-[1.6] text-white/85">
                {content.description}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <Button href={content.action.href} variant="light" size="sm" className="mt-6">
                {content.action.label}
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
