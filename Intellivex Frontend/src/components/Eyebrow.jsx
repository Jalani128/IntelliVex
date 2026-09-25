import asterisk from "../assets/icon.png";

/** Blue asterisk + uppercase label that opens every section in the design. */
export default function Eyebrow({ children, className = "" }) {
  return (
    <p className={`eyebrow flex items-center gap-2.5 ${className}`}>
      <img src={asterisk} alt="" aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      {children}
    </p>
  );
}
