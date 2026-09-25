import Button from "./Button";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";
import DecorSquares from "./DecorSquares";
import { PROJECTS } from "../data/home";

const SHAPES = [{ className: "right-[3%] top-[12%]", size: 82, drift: 15, duration: 11 }];

/**
 * @param {{eyebrow, title, highlight, items: Array}} content
 * @param {Array}  shapes   Decorative tile clusters for this section.
 * @param {string} padding  Vertical rhythm; inner pages run tighter than home.
 */
export default function Projects({
  id = "portfolio",
  content = PROJECTS,
  shapes = SHAPES,
  padding = "section-pad",
}) {
  return (
    <section id={id} className={`${padding} relative bg-navy`}>
      <DecorSquares shapes={shapes} />

      <div className="container-narrow relative">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          highlight={content.highlight}
          action={
            <Button href="#portfolio" variant="outline" size="sm">
              View All
            </Button>
          }
        />

        <div className="mt-10 flex flex-col gap-8">
          {content.items.map((project, i) => (
            <Reveal key={i} delay={0.1 * i}>
              <ProjectCard {...project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
