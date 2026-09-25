import { motion, useReducedMotion } from "framer-motion";
import bgIcon from "../assets/bgicon.png";

/**
 * The translucent square motif scattered behind the hero / services /
 * projects / CTA art. `bgicon.png` is an 82×82 tile that already carries the
 * diagonal two-square pattern from the design, so one image = one cluster.
 *
 * Each tile gets its own drift distance, duration and delay so the group
 * never moves in lockstep.
 *
 * @param {Array<{className: string, size?: number, opacity?: number,
 *                drift?: number, duration?: number, delay?: number}>} shapes
 */
export default function DecorSquares({ shapes = [], className = "" }) {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {shapes.map((shape, i) => (
        <motion.img
          key={i}
          src={bgIcon}
          alt=""
          className={`absolute block select-none ${shape.className}`}
          style={{
            width: shape.size ?? 82,
            opacity: shape.opacity ?? 1,
          }}
          animate={
            reduced
              ? undefined
              : {
                  y: [0, -(shape.drift ?? 14), 0],
                  x: [0, (shape.drift ?? 14) / 2, 0],
                }
          }
          transition={{
            duration: shape.duration ?? 8,
            delay: shape.delay ?? 0,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
