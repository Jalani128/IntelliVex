import { useCallback, useEffect, useRef, useState } from "react";
import Button from "./Button";
import SectionHeading from "./SectionHeading";
import TeamCard, { TeamCardSkeleton } from "./TeamCard";
import { LEADERSHIP_HEADING } from "../data/about";
import { fetchTeamSection, toLeadership } from "../services/team";

/* Same pill as Portfolio's Retry button. */
const PILL_BUTTON =
  "cursor-pointer rounded-full border border-white/20 bg-white/[0.04] px-8 py-3 font-display text-[11px] font-semibold uppercase tracking-[0.1em] text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/[0.08] hover:text-white";

const GRID = "grid gap-12 sm:grid-cols-2 lg:grid-cols-3";

/** "Our Leadership" — heading, VIEW ALL button and members all come from GET /api/team-section. */
export default function Leadership() {
  const [state, setState] = useState({ status: "loading", data: null });
  const alive = useRef(true);

  const load = useCallback(() => {
    setState({ status: "loading", data: null });
    fetchTeamSection()
      .then((raw) => alive.current && setState({ status: "ready", data: toLeadership(raw) }))
      .catch(() => alive.current && setState({ status: "error", data: null }));
  }, []);

  useEffect(() => {
    alive.current = true;
    load();
    return () => {
      alive.current = false;
    };
  }, [load]);

  const { status, data } = state;
  // The default heading holds the section's place until the API answers.
  const heading = data ?? LEADERSHIP_HEADING;
  const members = data?.members ?? [];

  return (
    <section id="leadership" className="section-pad-inner relative bg-navy lg:pb-[78px]">
      <div className="container-narrow">
        <SectionHeading
          eyebrow={heading.eyebrow}
          title={heading.title}
          highlight={heading.highlight}
          tail={heading.tail}
          action={
            heading.action && (
              <Button href={heading.action.href} variant="light" size="sm">
                {heading.action.label}
              </Button>
            )
          }
        />

        <div className="mt-10 lg:mt-[38px]" aria-live="polite" aria-busy={status === "loading"}>
          {status === "loading" && (
            <div className={GRID}>
              {[0, 1, 2].map((i) => (
                <TeamCardSkeleton key={i} />
              ))}
            </div>
          )}

          {status === "error" && (
            <div className="surface-card flex flex-col items-center gap-5 px-6 py-12 text-center">
              <p className="font-body text-[15px] text-white/75">We couldn’t load our team. Please try again.</p>
              <button type="button" onClick={load} className={PILL_BUTTON}>
                Try Again
              </button>
            </div>
          )}

          {status === "ready" && members.length === 0 && (
            <p className="surface-card px-6 py-12 text-center font-body text-[15px] text-white/70">
              Our leadership team will be introduced here soon.
            </p>
          )}

          {status === "ready" && members.length > 0 && (
            <div className={GRID}>
              {members.map((member, i) => (
                <TeamCard key={member.id ?? i} {...member} delay={i * 0.12} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
