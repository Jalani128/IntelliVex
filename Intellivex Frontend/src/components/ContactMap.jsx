import Reveal from "./Reveal";
import DecorSquares from "./DecorSquares";
import mapImage from "../assets/map.png";

const MAP_SHAPES = [
  { className: "right-[4%] top-[12%]", size: 82, drift: 15, duration: 11, delay: 0.5 },
];

export default function ContactMap() {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Azure Business Center, 8 Noyabr, Baku, Azerbaijan"
  )}`;

  return (
    <section id="office-location" className="pb-16 pt-0 md:pb-20 md:pt-0 lg:pb-[104px] lg:pt-0 relative overflow-hidden bg-navy">
      <DecorSquares shapes={MAP_SHAPES} className="hidden lg:block" />

      <div className="container-narrow relative">
        <Reveal delay={0.15}>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open IntelliVex office location in Google Maps"
            className="group block overflow-hidden rounded-card border border-white/12 bg-white/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-all duration-500 ease-[var(--ease-out-soft)] hover:border-accent/60 hover:shadow-[0_28px_60px_-20px_rgba(6,86,243,0.5)]"
          >
            <img
              src={mapImage}
              alt="IntelliVex Office Map — Azure Business Center, Baku, Azerbaijan"
              className="h-auto w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.02]"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
