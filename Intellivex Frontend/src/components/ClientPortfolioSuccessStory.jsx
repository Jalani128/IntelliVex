import Reveal from "./Reveal";
import RichContent from "./RichContent";

/**
 * The client's success-story box — `successStory`: { title, html, image } from
 * toClientDetail() (services/testimonials.js). Left out when the client has none.
 */
export default function ClientPortfolioSuccessStory({ successStory }) {
  if (!successStory) return null;

  return (
    <section className="relative bg-navy pb-16 pt-4 sm:pb-20 lg:pb-24 lg:pt-6">
      <div className="container-narrow relative">
        <Reveal y={24}>
          <div className="surface-card rounded-card border border-white/12 bg-white/[0.03] p-7 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.4)] sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-12">
              {/* Left Column: Heading & Narrative */}
              <div>
                <h3 className="font-display text-[28px] font-medium leading-[1.2] text-white sm:text-[32px] lg:text-[38px]">
                  {successStory.title}
                </h3>

                <RichContent
                  html={successStory.html}
                  className="mt-5 text-[14px] leading-[1.7] text-white/75 sm:mt-6 sm:text-[15px] lg:text-[16px]"
                />
              </div>

              {/* Right Column: story photo */}
              <div className="overflow-hidden rounded-[12px] border border-white/10 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.4)] sm:rounded-[16px]">
                <img
                  src={successStory.image.src}
                  alt={successStory.image.alt}
                  onError={(e) => {
                    if (successStory.image.fallback && e.currentTarget.getAttribute("src") !== successStory.image.fallback) {
                      e.currentTarget.src = successStory.image.fallback;
                    }
                  }}
                  className="h-[220px] w-full object-cover sm:h-[260px] lg:h-[300px]"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
