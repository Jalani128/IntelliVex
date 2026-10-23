import { useEffect, useState } from "react";
import { ArrowRight, Check, ChevronDown, ShieldCheck } from "lucide-react";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import DecorSquares from "./DecorSquares";
import { CONSULTATION } from "../data/dataScience";
import { submitInquiry, validateInquiry } from "../services/contact";

/* One cluster left of the heading, matching the frame. */
const CONSULT_SHAPES = [
  { className: "left-[3%] top-[8%]", size: 82, drift: 14, duration: 10, delay: 0.3 },
];

const INPUT_CLS =
  "w-full rounded-lg border border-white/15 bg-white/[0.08] px-5 py-3.5 font-body text-[15px] text-white placeholder:text-white/55 transition-colors duration-200 focus:border-accent focus:bg-white/[0.1] focus:outline-none focus:ring-2 focus:ring-accent/25 aria-[invalid=true]:border-red-400/80";

/* Labels stay for screen readers; the placeholders carry the visible text. */
const LABEL_CLS = "sr-only";

const EMPTY = {
  full_name: "",
  email: "",
  company_name: "",
  job_role: "",
  phone: "",
  service_of_interest: "",
  users_or_sites: "",
  timeline: "",
  message: "",
  agree_terms: false,
};

const SERVICE_OPTIONS = [
  "AI & Data Innovation",
  "Software Engineering",
  "Web Development",
  "Mobile App Development",
  "Cloud Infrastructure & Cybersecurity",
  "Game Development",
  "IT Consulting & Digital Transformation",
  "Other Solutions",
];

const TIMELINE_OPTIONS = [
  "Immediately",
  "Within 1 month",
  "1 – 3 months",
  "3 – 6 months",
  "6+ months",
  "Flexible",
];

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <span id={id} className="mt-1 block font-body text-[12px] text-red-400 font-medium">
      {message}
    </span>
  );
}

export default function ConsultationSection({ content = CONSULTATION }) {
  const { eyebrow, title, highlight, description, image, contact, address, form } = content;
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // idle | loading | success | error
  const [status, setStatus] = useState("idle");
  const [notice, setNotice] = useState("");

  // The success banner clears itself after a few seconds.
  useEffect(() => {
    if (status !== "success") return undefined;
    const id = setTimeout(() => setStatus("idle"), 6000);
    return () => clearTimeout(id);
  }, [status]);

  const update = (key) => (e) => {
    const val = e?.target ? e.target.value : e;
    setValues((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleToggleCaptcha = () => {
    if (captchaVerified) return;
    setCaptchaLoading(true);
    setTimeout(() => {
      setCaptchaLoading(false);
      setCaptchaVerified(true);
      if (errors.captcha) {
        setErrors((prev) => ({ ...prev, captcha: undefined }));
      }
    }, 450);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "loading") return;

    const clientErrors = validateInquiry(
      { ...values, captchaVerified },
      { checkCaptcha: true, checkConsent: true }
    );

    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      setStatus("idle");
      return;
    }

    setStatus("loading");
    setErrors({});
    try {
      const res = await submitInquiry(values);
      setValues(EMPTY);
      setCaptchaVerified(false);
      setNotice(res?.message || "Thank you! Your inquiry has been submitted successfully.");
      setStatus("success");
    } catch (err) {
      setErrors(err.errors ?? {});
      setNotice(err.message || "Failed to submit inquiry. Please try again.");
      setStatus("error");
    }
  };

  return (
    <section id="consultation" className="section-pad-inner relative overflow-hidden bg-navy">
      <DecorSquares shapes={CONSULT_SHAPES} className="hidden lg:block" />

      <div className="container-narrow relative">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_560px] lg:gap-x-[44px]">
          {/* Contact details */}
          <div>
            <Reveal y={20}>
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="mt-4 font-display text-[32px] font-medium leading-[1.15] text-white sm:text-[40px] lg:text-[52px] lg:leading-[64px]">
                {title} <span className="text-gradient">{highlight}</span>
              </h2>
            </Reveal>

            {description && (
              <Reveal delay={0.15}>
                <p className="mt-4 max-w-[500px] font-body text-[15px] leading-[1.65] text-white/75">
                  {description}
                </p>
              </Reveal>
            )}

            {[contact, address].filter(Boolean).map((block, i) => (
              <Reveal key={block.title} delay={0.2 + i * 0.1}>
                <div className="mt-8">
                  <h3 className="font-display text-[26px] font-medium leading-tight text-white lg:text-[32px]">
                    {block.title}
                  </h3>

                  <ul className="mt-3 space-y-1.5">
                    {block.lines.map((line) => (
                      <li key={line.text} className="font-body text-[15px] leading-[1.6] text-white/80">
                        {line.href ? (
                          <a
                            href={line.href}
                            className="transition-colors duration-300 hover:text-accent-soft"
                          >
                            {line.text}
                          </a>
                        ) : (
                          line.text
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}

            {image && (
              <Reveal delay={0.4}>
                <div className="mt-8 overflow-hidden rounded-card border border-white/10 bg-white/[0.03] shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
                  <img
                    src={image.src || image}
                    alt={image.alt || "Intellivex Contact"}
                    className="h-auto w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                </div>
              </Reveal>
            )}
          </div>

          {/* Consultation form card */}
          <Reveal delay={0.24} className="w-full">
            <div className="rounded-[24px] border border-white/10 bg-navy-soft p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] sm:p-10">
              <form onSubmit={onSubmit} noValidate aria-busy={status === "loading"}>
                {form?.title && (
                  <h3 className="mb-8 text-center font-display text-[26px] font-semibold text-white lg:text-[32px]">
                    {form.title}
                  </h3>
                )}

                <div aria-live="polite">
                  {status === "success" && (
                    <div className="mb-5 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-center font-body text-[13.5px] font-medium text-emerald-300">
                      {notice}
                    </div>
                  )}
                  {status === "error" && (
                    <div
                      role="alert"
                      className="mb-5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-center font-body text-[13.5px] font-medium text-red-300"
                    >
                      {notice}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Full name */}
                    <div>
                      <label htmlFor="full_name" className={LABEL_CLS}>
                        Full name (required)
                      </label>
                      <input
                        id="full_name"
                        type="text"
                        name="full_name"
                        value={values.full_name}
                        onChange={update("full_name")}
                        autoComplete="name"
                        placeholder="Full Name *"
                        required
                        aria-invalid={!!errors.full_name}
                        aria-describedby={errors.full_name ? "full_name-error" : undefined}
                        className={INPUT_CLS}
                      />
                      <FieldError id="full_name-error" message={errors.full_name} />
                    </div>

                    {/* Business email */}
                    <div>
                      <label htmlFor="email" className={LABEL_CLS}>
                        Business email (required)
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={update("email")}
                        autoComplete="email"
                        placeholder="Business Email *"
                        required
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        className={INPUT_CLS}
                      />
                      <FieldError id="email-error" message={errors.email} />
                    </div>

                    {/* Company name */}
                    <div>
                      <label htmlFor="company_name" className={LABEL_CLS}>
                        Company name (required)
                      </label>
                      <input
                        id="company_name"
                        type="text"
                        name="company_name"
                        value={values.company_name}
                        onChange={update("company_name")}
                        autoComplete="organization"
                        placeholder="Company Name *"
                        required
                        aria-invalid={!!errors.company_name}
                        aria-describedby={errors.company_name ? "company_name-error" : undefined}
                        className={INPUT_CLS}
                      />
                      <FieldError id="company_name-error" message={errors.company_name} />
                    </div>

                    {/* Job role */}
                    <div>
                      <label htmlFor="job_role" className={LABEL_CLS}>
                        Job role (required)
                      </label>
                      <input
                        id="job_role"
                        type="text"
                        name="job_role"
                        value={values.job_role}
                        onChange={update("job_role")}
                        autoComplete="organization-title"
                        placeholder="Job Role *"
                        required
                        aria-invalid={!!errors.job_role}
                        aria-describedby={errors.job_role ? "job_role-error" : undefined}
                        className={INPUT_CLS}
                      />
                      <FieldError id="job_role-error" message={errors.job_role} />
                    </div>

                    {/* Phone number (optional) */}
                    <div>
                      <label htmlFor="phone" className={LABEL_CLS}>
                        Phone number (optional)
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={values.phone}
                        onChange={update("phone")}
                        autoComplete="tel"
                        placeholder="Phone (optional)"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                        className={INPUT_CLS}
                      />
                      <FieldError id="phone-error" message={errors.phone} />
                    </div>

                    {/* Service of interest */}
                    <div>
                      <label htmlFor="service_of_interest" className={LABEL_CLS}>
                        Service of interest (required)
                      </label>
                      <div className="relative">
                        <select
                          id="service_of_interest"
                          name="service_of_interest"
                          value={values.service_of_interest}
                          onChange={update("service_of_interest")}
                          required
                          aria-invalid={!!errors.service_of_interest}
                          aria-describedby={errors.service_of_interest ? "service_of_interest-error" : undefined}
                          className={`${INPUT_CLS} appearance-none pr-10 cursor-pointer ${
                            !values.service_of_interest ? "text-white/55" : "text-white"
                          }`}
                        >
                          <option value="" disabled className="bg-navy-soft text-white/55">
                            Service of Interest *
                          </option>
                          {SERVICE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} className="bg-navy-soft text-white">
                              {opt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 size-4 text-white/55" />
                      </div>
                      <FieldError id="service_of_interest-error" message={errors.service_of_interest} />
                    </div>

                    {/* Number of users / sites (optional) */}
                    <div>
                      <label htmlFor="users_or_sites" className={LABEL_CLS}>
                        Number of users / sites (optional)
                      </label>
                      <input
                        id="users_or_sites"
                        type="text"
                        name="users_or_sites"
                        value={values.users_or_sites}
                        onChange={update("users_or_sites")}
                        placeholder="Users / Sites (optional)"
                        className={INPUT_CLS}
                      />
                    </div>

                    {/* Project timeline */}
                    <div>
                      <label htmlFor="timeline" className={LABEL_CLS}>
                        Project timeline (required)
                      </label>
                      <div className="relative">
                        <select
                          id="timeline"
                          name="timeline"
                          value={values.timeline}
                          onChange={update("timeline")}
                          required
                          aria-invalid={!!errors.timeline}
                          aria-describedby={errors.timeline ? "timeline-error" : undefined}
                          className={`${INPUT_CLS} appearance-none pr-10 cursor-pointer ${
                            !values.timeline ? "text-white/55" : "text-white"
                          }`}
                        >
                          <option value="" disabled className="bg-navy-soft text-white/55">
                            Project Timeline *
                          </option>
                          {TIMELINE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} className="bg-navy-soft text-white">
                              {opt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 size-4 text-white/55" />
                      </div>
                      <FieldError id="timeline-error" message={errors.timeline} />
                    </div>
                  </div>

                  {/* Short description */}
                  <div>
                    <label htmlFor="message" className={LABEL_CLS}>
                      Short description (required)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={values.message}
                      onChange={update("message")}
                      placeholder={`${form?.message || "Write Message"} *`}
                      required
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "message-error" : undefined}
                      className={`${INPUT_CLS} resize-y`}
                    />
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/55">
                      What would you like to improve, and is there a deadline or site visit we should know about?
                    </p>
                    <FieldError id="message-error" message={errors.message} />
                  </div>

                  {/* Captcha Box */}
                  <div>
                    <div
                      className={`flex items-center justify-between rounded-lg border px-4 py-3 bg-white/[0.06] transition-colors ${
                        errors.captcha ? "border-red-400/80" : "border-white/15"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={handleToggleCaptcha}
                        className="flex items-center gap-3 cursor-pointer select-none text-left focus:outline-none"
                      >
                        <span
                          className={`size-6 rounded border flex items-center justify-center transition-all ${
                            captchaVerified
                              ? "bg-[#22c55e] border-[#22c55e] text-white shadow-sm"
                              : captchaLoading
                                ? "border-white/30 bg-transparent"
                                : "border-white/30 bg-transparent hover:border-white/50"
                          }`}
                        >
                          {captchaLoading ? (
                            <span className="size-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                          ) : captchaVerified ? (
                            <Check className="size-4 stroke-[3]" />
                          ) : null}
                        </span>
                        <span className="text-[13.5px] font-medium text-white/85">I'm not a robot</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 select-none">
                        <ShieldCheck className="size-4 text-emerald-400" />
                        <span>Protected</span>
                      </div>
                    </div>
                    <FieldError id="captcha-error" message={errors.captcha} />
                  </div>

                  {/* Privacy agreement checkbox */}
                  <div>
                    <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs sm:text-[13px] text-white/70 leading-snug">
                      <input
                        type="checkbox"
                        checked={values.agree_terms}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setValues((prev) => ({ ...prev, agree_terms: checked }));
                          if (errors.agree_terms) {
                            setErrors((prev) => ({ ...prev, agree_terms: undefined }));
                          }
                        }}
                        className="mt-0.5 size-4 rounded cursor-pointer accent-accent"
                      />
                      <span>
                        I agree to be contacted about this enquiry and have read the{" "}
                        <button
                          type="button"
                          onClick={() => setShowPrivacy(true)}
                          className="text-accent-soft font-medium underline underline-offset-2 hover:text-white"
                        >
                          privacy notice
                        </button>
                        . <span className="text-red-400 font-bold">*</span>
                      </span>
                    </label>
                    <FieldError id="agree_terms-error" message={errors.agree_terms} />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-4 font-display text-[17px] font-medium text-white transition-all duration-200 hover:bg-accent-deep disabled:cursor-wait disabled:opacity-60 active:scale-[0.99]"
                    >
                      <span>{status === "loading" ? "Sending…" : form?.action || "Send enquiry"}</span>
                      <ArrowRight className="size-4" />
                    </button>
                  </div>

                  {/* Footer note */}
                  <p className="text-center text-[12px] text-white/50">
                    Fields marked <span className="text-red-400 font-bold">*</span> are required.
                  </p>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Privacy Notice Modal */}
      {showPrivacy && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShowPrivacy(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl text-slate-800 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPrivacy(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 text-lg focus:outline-none"
              aria-label="Close"
            >
              ✕
            </button>
            <h4 className="font-display text-xl font-semibold text-slate-900 mb-2">Privacy Notice</h4>
            <div className="text-xs sm:text-sm text-slate-600 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              <p>
                At IntelliVex, your privacy is paramount. Any information submitted through this inquiry form
                is used exclusively to evaluate your business requirements and provide you with relevant consultation.
              </p>
              <p>
                We do not sell, rent, or share your contact or company details with external marketing entities.
                Your data is securely stored and treated in accordance with international data privacy standards.
              </p>
              <p>
                If you have questions regarding your data or wish to request removal of your submission, please reach
                out to us directly at info@theintellivex.com.
              </p>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPrivacy(false)}
                className="rounded-lg bg-accent px-5 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-accent-deep"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
