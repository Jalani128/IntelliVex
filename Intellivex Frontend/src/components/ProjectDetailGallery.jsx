import Reveal from "./Reveal";
import { PROJECT_DETAIL_DATA } from "../data/projectDetail";

export default function ProjectDetailGallery({ data = PROJECT_DETAIL_DATA }) {
  const { hero, gallery } = data.images;

  return (
    <section className="relative bg-navy pb-12 pt-2 sm:pb-16 sm:pt-4 lg:pb-20 lg:pt-4">
      <div className="container-narrow relative">
        {/* Featured Wide Banner Showcase */}
        <Reveal y={24}>
          <div className="group overflow-hidden rounded-[14px] border border-white/12 bg-white/[0.03] shadow-[0_24px_50px_-20px_rgba(0,0,0,0.4)] transition-all duration-500 hover:border-white/25 sm:rounded-[18px]">
            <img
              src={hero.src}
              alt={hero.alt}
              className="w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.015]"
            />
          </div>
        </Reveal>

        {/* Two-Column Companion Mockup Gallery */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:mt-6 sm:grid-cols-2 sm:gap-6 lg:mt-8 lg:gap-8">
          {gallery.map((img, i) => (
            <Reveal key={i} delay={0.1 * (i + 1)} y={20}>
              <div className="group overflow-hidden rounded-[14px] border border-white/12 bg-white/[0.03] shadow-[0_20px_45px_-18px_rgba(0,0,0,0.35)] transition-all duration-500 hover:border-white/25 sm:rounded-[18px]">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.02]"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
