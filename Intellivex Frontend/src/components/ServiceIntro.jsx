import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import SiteLink from "./SiteLink";
import DecorSquares from "./DecorSquares";
import { SERVICE_INTRO } from "../data/serviceDetail";

const INTRO_SHAPES = [
  { className: "left-[3%] bottom-[16%]", size: 82, drift: 14, duration: 10, delay: 0.4 },
];

/**
 * The block a service page opens with: eyebrow, two-tone heading and copy across
 * the full column, then the service photo.
 *
 * Two shapes in the frames. With `tags`, the sibling-service pills sit on the
 * left and the photo is held to the right (Service Details). Without them the
 * photo runs the full column (Data Science).
 */
export default function ServiceIntro({ content = SERVICE_INTRO }) {
  const { eyebrow, title, highlight, paragraphs, tags, image } = content;

  const photo = (
    <img
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      className="w-full rounded-card"
    />
  );

  return (
    <section
      id="service-intro"
      className="bg-about-glow relative overflow-hidden bg-navy pb-14 pt-4 md:pb-16 md:pt-8 lg:pb-[70px] lg:pt-[52px]"
    >
      <DecorSquares shapes={INTRO_SHAPES} className="hidden lg:block" />

      <div className="container-narrow relative">
        <Reveal y={20}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mt-4 font-display text-[32px] font-medium leading-[1.15] text-white sm:text-[40px] lg:text-[52px] lg:leading-[64px]">
            {title} <span className="text-gradient">{highlight}</span>
          </h2>
        </Reveal>

        <div className="mt-6 space-y-[26px]">
          {paragraphs.map((text, i) => (
            <Reveal key={i} delay={0.18 + i * 0.08}>
              <p className="font-body text-[15px] leading-[1.62] text-white/80 lg:text-[16px]">
                {text}
              </p>
            </Reveal>
          ))}
        </div>

        {tags ? (
          /* The pill column is held to 360px so the list breaks across five rows
             exactly as the frame does; the photo keeps its native 651px. */
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_651px] lg:gap-x-[49px]">
            <Reveal delay={0.3} className="lg:max-w-[360px]">
              <ul className="flex flex-wrap gap-x-[28px] gap-y-4">
                {tags.map((tag) => (
                  <li
                    key={tag.label}
                    className={`rounded-md border px-[22px] py-1 font-body text-[15px] leading-[1.4] transition-colors duration-300 ${
                      tag.active
                        ? "border-accent bg-accent text-white"
                        : "border-white/45 text-white/90 hover:border-accent hover:text-white"
                    }`}
                  >
                    {tag.to ? <SiteLink href={tag.to}>{tag.label}</SiteLink> : tag.label}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.36} className="w-full">
              {photo}
            </Reveal>
          </div>
        ) : (
          <Reveal delay={0.3} className="mt-10 block w-full">
            {photo}
          </Reveal>
        )}
      </div>
    </section>
  );
}
