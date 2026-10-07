import Button from "./Button";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import ProjectCard, { ProjectCardSkeleton } from "./ProjectCard";
import DecorSquares from "./DecorSquares";
import { PROJECTS } from "../data/home";
import { PROJECT_IMAGE_PLACEHOLDER } from "../data/portfolio";
import { toProjectCard } from "../services/portfolio";
import { useProjects } from "../hooks/useProjectList";

const SHAPES = [{ className: "right-[3%] top-[12%]", size: 82, drift: 15, duration: 11 }];
const HOME_QUERY = { home: 1 };

/**
 * Two project cards from the API. Home asks for `show_on_home` projects; other
 * pages pass their own `query`. Left out when there's nothing to show.
 *
 * @param {{eyebrow, title, highlight}} content  Section heading.
 * @param {object} query    GET /api/projects params.
 * @param {Array}  shapes   Decorative tile clusters for this section.
 * @param {string} padding  Vertical rhythm; inner pages run tighter than home.
 */
export default function Projects({
  id = "portfolio",
  content = PROJECTS,
  query = HOME_QUERY,
  limit = 2,
  shapes = SHAPES,
  padding = "section-pad",
}) {
  const { status, items } = useProjects(query, limit);
  if (status === "error" || (status === "ready" && items.length === 0)) return null;

  return (
    <section id={id} className={`${padding} relative bg-navy`}>
      <DecorSquares shapes={shapes} />

      <div className="container-narrow relative">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          highlight={content.highlight}
          action={
            <Button href="/portfolio" variant="outline" size="sm">
              View All
            </Button>
          }
        />

        <div className="mt-10 flex flex-col gap-8" aria-busy={status === "loading"}>
          {status === "loading"
            ? Array.from({ length: limit }, (_, i) => <ProjectCardSkeleton key={i} />)
            : items.map((project, i) => (
                <Reveal key={project.id} delay={0.1 * i}>
                  <ProjectCard {...toProjectCard(project, { fallbackImage: PROJECT_IMAGE_PLACEHOLDER })} />
                </Reveal>
              ))}
        </div>
      </div>
    </section>
  );
}
