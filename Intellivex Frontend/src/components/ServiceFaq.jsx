import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import Reveal from "./Reveal";
import DecorSquares from "./DecorSquares";
import { SERVICE_FAQ } from "../data/serviceDetail";

/* One cluster left of the heading, one low on the right — as in the frame. */
const FAQ_SHAPES = [
  { className: "left-[3%] top-[6%]", size: 82, drift: 13, duration: 10 },
  { className: "right-[4%] bottom-[22%]", size: 82, drift: 15, duration: 12, delay: 0.7 },
];

/**
 * "Frequently Asked Questions" — a numbered accordion. One panel is open at a
 * time and the first opens by default, matching the frame.
 */
export default function ServiceFaq() {
  const { title, items } = SERVICE_FAQ;
  const [openIndex, setOpenIndex] = useState(0);
  const baseId = useId();

  return (
    <section id="faq" className="section-pad-inner relative overflow-hidden bg-navy pt-2 lg:pt-4">
      <DecorSquares shapes={FAQ_SHAPES} className="hidden lg:block" />

      <div className="container-narrow relative">
        <Reveal>
          <h2 className="text-gradient font-display text-[32px] font-medium leading-[1.15] sm:text-[40px] lg:text-[52px] lg:leading-[64px]">
            {title}
          </h2>
        </Reveal>

        <ul className="mt-8 flex flex-col gap-4">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            const panelId = `${baseId}-faq-${i}`;

            return (
              <Reveal as="li" key={i} delay={0.06 * i} y={20}>
                <div
                  className={`surface-card overflow-hidden transition-colors duration-300 ${
                    isOpen ? "border-accent/45" : "hover:border-white/25"
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="flex w-full items-center justify-between gap-6 px-5 py-4 text-left lg:px-7"
                    >
                      <span className="font-display text-[15px] font-medium leading-snug text-white lg:text-[16px]">
                        {i + 1}. {item.question}
                      </span>

                      <span
                        aria-hidden="true"
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-white transition-transform duration-300 ease-[var(--ease-out-soft)] lg:h-8 lg:w-8"
                      >
                        {isOpen ? <Minus size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="border-t border-white/10 bg-white/[0.03] px-5 py-4 font-body text-[13px] leading-[1.7] text-white/70 lg:px-7 lg:text-[14px]">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
