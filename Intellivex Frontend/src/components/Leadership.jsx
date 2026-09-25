import Button from "./Button";
import SectionHeading from "./SectionHeading";
import TeamCard from "./TeamCard";
import { LEADERSHIP } from "../data/about";

export default function Leadership() {
  return (
    <section id="leadership" className="section-pad-inner relative bg-navy lg:pb-[78px]">
      <div className="container-narrow">
        <SectionHeading
          eyebrow={LEADERSHIP.eyebrow}
          title={LEADERSHIP.title}
          highlight={LEADERSHIP.highlight}
          action={
            <Button href={LEADERSHIP.action.href} variant="light" size="sm">
              {LEADERSHIP.action.label}
            </Button>
          }
        />

        <div className="mt-10 grid gap-12 sm:grid-cols-2 lg:mt-[38px] lg:grid-cols-3">
          {LEADERSHIP.team.map((member, i) => (
            <TeamCard key={i} {...member} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}
