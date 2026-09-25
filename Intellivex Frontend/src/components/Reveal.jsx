import { motion } from "framer-motion";


export default function Reveal({
  as = "div",
  delay = 0,
  y = 28,
  x = 0,
  duration = 0.6,
  once = true,
  className = "",
  children,
  ...props
}) {
  const MotionTag = motion[as] ?? motion.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount: 0, margin: "0px 0px -10% 0px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </MotionTag>
  );
}