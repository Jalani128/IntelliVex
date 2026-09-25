
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import axios from "axios";
import webLogo from "/logo.svg";


function GradientPopText({ text, baseDelay = 0, step = 0.045, mounted }) {
  const containerRef = useRef(null);
  const letterRefs = useRef([]);
  const [metrics, setMetrics] = useState(null); // { width, offsets: number[] }

  letterRefs.current = [];

  const measure = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const offsets = letterRefs.current.map((el) =>
      el ? el.getBoundingClientRect().left - containerRect.left : 0
    );
    setMetrics({ width: containerRect.width, offsets });
  };

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, mounted]);

  const tokens = text.match(/\S+|\s+/g) || [];
  let letterIndex = 0;

  return (
    <span ref={containerRef} className="inline-block relative">
      {tokens.map((token, tIdx) => {
        if (/^\s+$/.test(token)) {
          return (
            <span key={tIdx} style={{ whiteSpace: "pre" }}>
              {token}
            </span>
          );
        }
        return (
          <span key={tIdx} className="inline-block whitespace-nowrap">
            {token.split("").map((ch, cIdx) => {
              const idx = letterIndex;
              letterIndex += 1;
              const delay = baseDelay + idx * step;
              const offset = metrics ? metrics.offsets[idx] || 0 : 0;
              return (
                <span
                  key={cIdx}
                  ref={(el) => (letterRefs.current[idx] = el)}
                  className={[
                    "inline-block",
                    mounted ? "letter-pop" : "opacity-0",
                    "bg-linear-to-r from-[#5b8bff] to-white bg-clip-text text-transparent",
                  ].join(" ")}
                  style={{
                    ...(mounted ? { animationDelay: `${delay}s` } : {}),
                    backgroundSize: metrics ? `${metrics.width}px 100%` : undefined,
                    backgroundPositionX: metrics ? `-${offset}px` : undefined,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}

function PopLetters({ text, baseDelay = 0, step = 0.045, mounted }) {
  const tokens = text.match(/\S+|\s+/g) || [];
  let letterIndex = 0;
  return (
    <>
      {tokens.map((token, tIdx) => {
        if (/^\s+$/.test(token)) {
          return (
            <span key={tIdx} style={{ whiteSpace: "pre" }}>
              {token}
            </span>
          );
        }
        return (
          <span key={tIdx} className="inline-block whitespace-nowrap">
            {token.split("").map((ch, cIdx) => {
              const delay = baseDelay + letterIndex * step;
              letterIndex += 1;
              return (
                <span
                  key={cIdx}
                  className={[
                    "inline-block",
                    mounted ? "letter-pop" : "opacity-0",
                  ].join(" ")}
                  style={mounted ? { animationDelay: `${delay}s` } : undefined}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        );
      })}
    </>
  );
}

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const glowRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (glowRef.current) {
        glowRef.current.style.setProperty("--mx", `${e.clientX}px`);
        glowRef.current.style.setProperty("--my", `${e.clientY}px`);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubscribe = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      setStatus("loading");
      setMessage("");

      const baseUrl = import.meta.env.VITE_API_URL;

      const response = await axios.post(
        `${baseUrl}subscribe`,
        { email: trimmedEmail },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setStatus("success");
      setMessage(response?.data?.message || "Thank you for subscribing!");
      setEmail("");
    } catch (error) {
      const statusCode = error?.response?.status;
      const serverMessage = error?.response?.data?.message;

      if (statusCode === 409) {
        setStatus("duplicate");
        setMessage(serverMessage || "This email is already subscribed.");
      } else {
        setStatus("error");
        setMessage(serverMessage || "Something went wrong. Please try again.");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubscribe();
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#0b1e63] flex items-center justify-center px-4 sm:px-6">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes toCenterA {
          0%, 100% { left: 6%; top: 8%; transform: rotate(0deg) scale(1); }
          50% { left: 20%; top: 22%; transform: rotate(180deg) scale(1.1); }
        }
        @keyframes toCenterB {
          0%, 100% { left: 86%; top: 8%; transform: rotate(0deg) scale(1); }
          50% { left: 76%; top: 22%; transform: rotate(-180deg) scale(1.1); }
        }
        @keyframes toCenterC {
          0%, 100% { left: 6%; top: 86%; transform: rotate(0deg) scale(1); }
          50% { left: 20%; top: 76%; transform: rotate(180deg) scale(1.1); }
        }
        @keyframes toCenterD {
          0%, 100% { left: 86%; top: 86%; transform: rotate(0deg) scale(1); }
          50% { left: 76%; top: 76%; transform: rotate(-180deg) scale(1.1); }
        }
        .animate-to-center-a { animation: toCenterA 16s ease-in-out infinite backwards; }
        .animate-to-center-b { animation: toCenterB 16s ease-in-out infinite backwards; animation-delay: 0.6s; }
        .animate-to-center-c { animation: toCenterC 16s ease-in-out infinite backwards; animation-delay: 1.2s; }
        .animate-to-center-d { animation: toCenterD 16s ease-in-out infinite backwards; animation-delay: 1.8s; }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(120px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-120px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.55; }
        }
        @keyframes letterPop {
          0% { opacity: 0; transform: scale(0.3) translateY(20px); }
          60% { opacity: 1; transform: scale(1.15) translateY(-4px); }
          80% { transform: scale(0.95) translateY(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .letter-pop {
          opacity: 0;
          animation: letterPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes statusPopIn {
          0% { opacity: 0; transform: scale(0.8) translateY(-18px); }
          55% { opacity: 1; transform: scale(1.04) translateY(2px); }
          75% { transform: scale(0.98) translateY(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes statusIconPop {
          0% { transform: scale(0) rotate(-40deg); }
          60% { transform: scale(1.3) rotate(8deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes statusGlow {
          0%, 100% { box-shadow: 0 0 0px 0px var(--glow-color); }
          50% { box-shadow: 0 0 22px 2px var(--glow-color); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .status-card {
          animation: statusPopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
            statusGlow 2.4s ease-in-out 0.6s infinite;
        }
        .status-card.status-error {
          animation: statusPopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
            statusGlow 2.4s ease-in-out 0.6s infinite,
            shake 0.5s ease-in-out 0.55s;
        }
        .status-icon {
          animation: statusIconPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards;
        }
        .animate-float {
          animation: float 7s ease-in-out infinite;
        }
        .animate-fade-up {
          opacity: 0;
          animation: fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-right {
          opacity: 0;
          animation: slideInRight 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-left {
          opacity: 0;
          animation: slideInLeft 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-glow {
          animation: glowPulse 6s ease-in-out infinite;
        }
        .mouse-glow {
          --mx: 50vw;
          --my: 50vh;
          background: radial-gradient(
            600px circle at var(--mx) var(--my),
            rgba(91, 139, 255, 0.35),
            rgba(59, 91, 255, 0.15) 40%,
            transparent 70%
          );
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-float, .animate-fade-up, .animate-glow,
          .animate-slide-right, .animate-slide-left,
          .animate-to-center-a, .animate-to-center-b,
          .animate-to-center-c, .animate-to-center-d,
          .letter-pop {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Background glow (right side) */}
      <div className="animate-glow pointer-events-none absolute -right-1/4 top-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-225 max-h-225 rounded-full bg-[#3b5bff] opacity-40 blur-[120px]" />

      {/* Mouse-following bright glow */}
      <div
        ref={glowRef}
        className="mouse-glow pointer-events-none absolute inset-0 transition-opacity duration-300"
      />

      {/* Background grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Background grid dots (intersections) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* Decorative corner squares - move to center, back home, repeat */}
      <CornerSquares roam="animate-to-center-a" />
      <CornerSquares roam="animate-to-center-b" />
      <CornerSquares roam="animate-to-center-c" />
      <CornerSquares roam="animate-to-center-d" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto py-12 sm:py-16 md:py-20">
        {/* Logo (image) */}
        <div
          className="flex items-center justify-center mb-12 sm:mb-20 mt-2 sm:mt-4 animate-fade-up"
          style={{ animationDelay: mounted ? "0.05s" : "0s" }}
        >
          
          <img
            src={webLogo}
            alt="IntelliVex Technologies"
            className="mb-16!"
          />
        </div>

        {/* Headline */}
        <h1
          className="font-bold! uppercase leading-[1.05] tracking-tight text-white flex flex-col items-center md:items-stretch"
        >
          <span
            className="text-4xl! xs:text-5xl! sm:text-6xl! md:text-7xl! self-center text-center"
          >
            <PopLetters text="Our New" baseDelay={0.15} mounted={mounted} />
          </span>
          <span
            className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl -mt-1 sm:-mt-2 self-center md:self-start md:ml-[12%]! text-center md:text-left"
          >
            <PopLetters text="Website" baseDelay={0.55} mounted={mounted} />
          </span>
          <span
            className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl -mt-1 sm:-mt-2 self-center md:ml-[24%]! text-center"
          >
            <GradientPopText text="is on the way" baseDelay={0.9} mounted={mounted} />
          </span>
        </h1>

        {/* Subscribe form */}
        <div
          className="mt-10! sm:mt-14 flex flex-col sm:flex-row items-stretch sm:items-center justify-center max-w-xl mx-auto animate-fade-up"
          style={{ gap: "0.75rem", animationDelay: mounted ? "2s" : "0s" }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Please enter your e-mail address"
            disabled={status === "loading"}
            className="w-full sm:w-80 px-6! py-3 sm:h-10.5 text-sm text-gray-700 placeholder-gray-400 bg-white outline-none focus:ring-2 disabled:opacity-70"
            style={{ borderRadius: "9999px" }}
          />
          <button
            type="button"
            onClick={handleSubscribe}
            disabled={status === "loading"}
            className="md:w-[20%]! md:py-2! sm:w-auto px-8 py-3 sm:h-10.5 text-sm font-semibold text-white bg-[#2f5bff] hover:bg-[#2648d6] transition-colors whitespace-nowrap appearance-none border-0 disabled:opacity-70"
            style={{ borderRadius: "9999px" }}
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </div>

        {/* Status message */}
        {message && (status === "success" || status === "error" || status === "duplicate") && (
          <div className="mt-6! sm:mt-8! flex justify-center items-center px-4 w-full">
            <div
              key={message}
              className={[
                "status-card",
                status === "error" ? "status-error" : "",
                "flex items-center justify-center gap-3 sm:gap-4 max-w-lg w-full sm:w-auto mx-auto",
                "px-5 py-3 sm:px-7 sm:py-3.5 rounded-2xl",
                "border bg-transparent",
                status === "success"
                  ? "border-emerald-400/40"
                  : status === "duplicate"
                  ? "border-amber-400/40"
                  : "border-red-400/40",
              ].join(" ")}
              style={{
                "--glow-color":
                  status === "success"
                    ? "rgba(52, 211, 153, 0.45)"
                    : status === "duplicate"
                    ? "rgba(251, 191, 36, 0.45)"
                    : "rgba(248, 113, 113, 0.45)",
              }}
            >
              <span
                className={[
                  "status-icon shrink-0 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-white",
                  status === "success"
                    ? "bg-emerald-500"
                    : status === "duplicate"
                    ? "bg-amber-500"
                    : "bg-red-500",
                ].join(" ")}
              >
                {status === "success" && (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {status === "duplicate" && (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <line x1="12" y1="8" x2="12" y2="13" />
                    <circle cx="12" cy="16.5" r="0.5" fill="currentColor" stroke="none" />
                  </svg>
                )}
                {status === "error" && (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </span>
              <span className="text-sm sm:text-base font-semibold text-white leading-snug text-center sm:text-left">
                {message}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CornerSquares({ roam = "animate-to-center-a" }) {
  return (
    <div className={`absolute hidden sm:block pointer-events-none ${roam}`}>
      <div className="relative w-14 h-14 animate-float">
        <div className="absolute top-0 left-0 w-7 h-7 bg-white/10" />
        <div className="absolute bottom-0 right-0 w-7 h-7 bg-white/10" />
      </div>
    </div>
  );
}