import Reveal from "./Reveal";
import IndustryCard from "./IndustryCard";
import DecorSquares from "./DecorSquares";
import { INDUSTRIES_LIST } from "../data/industries";

const LIST_SHAPES = [
  { className: "right-[3%] top-[15%]", size: 82, drift: 15, duration: 11, delay: 0.2 },
  { className: "left-[2%] bottom-[20%]", size: 82, drift: 13, duration: 12, delay: 0.8 },
];

export default function IndustryList({ items = INDUSTRIES_LIST }) {
  return (
    <section id="industries-list" className="relative bg-navy pb-16 pt-2 md:pb-20 lg:pb-[90px] lg:pt-4">
      <DecorSquares shapes={LIST_SHAPES} className="hidden lg:block" />

      <div className="container-narrow relative">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {items.map((industry, i) => (
            <Reveal key={industry.id || i} delay={0.08 * i} y={24}>
              <IndustryCard {...industry} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
