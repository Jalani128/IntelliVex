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
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 font-body text-[14px] text-slate-900 placeholder:text-slate-400 transition-colors duration-200 focus:border-[#4ade80] focus:outline-none focus:ring-2 focus:ring-[#4ade80]/20 aria-[invalid=true]:border-red-400/80";

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
    <span id={id} className="mt-1 block font-body text-[12px] text-red-500 font-medium">
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

          {/* Consultation form card matching user requirement */}
          <Reveal delay={0.24} className="w-full">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] text-slate-800">
              <form onSubmit={onSubmit} noValidate aria-busy={status === "loading"}>
                {form?.title && (
                  <h3 className="font-display text-[22px] lg:text-[24px] font-semibold text-slate-900 mb-4">
                    {form.title}
                  </h3>
                )}

                <div aria-live="polite">
                  {status === "success" && (
                    <div className="mb-5 rounded-lg border border-emerald-500/40 bg-emerald-50 px-4 py-3 text-center font-body text-[13.5px] font-medium text-emerald-800">
                      {notice}
                    </div>
                  )}
                  {status === "error" && (
                    <div
                      role="alert"
                      className="mb-5 rounded-lg border border-red-400/40 bg-red-50 px-4 py-3 text-center font-body text-[13.5px] font-medium text-red-700"
                    >
                      {notice}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Full name */}
                  <div>
                    <label className="block text-[13.5px] font-semibold text-slate-800 mb-1.5">
                      Full name <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={values.full_name}
                      onChange={update("full_name")}
                      autoComplete="name"
                      required
                      aria-invalid={!!errors.full_name}
                      aria-describedby={errors.full_name ? "full_name-error" : undefined}
                      className={INPUT_CLS}
                    />
                    <FieldError id="full_name-error" message={errors.full_name} />
                  </div>

                  {/* Business email */}
                  <div>
                    <label className="block text-[13.5px] font-semibold text-slate-800 mb-1.5">
                      Business email <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={update("email")}
                      autoComplete="email"
                      required
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={INPUT_CLS}
                    />
                    <FieldError id="email-error" message={errors.email} />
                  </div>

                  {/* Company name */}
                  <div>
                    <label className="block text-[13.5px] font-semibold text-slate-800 mb-1.5">
                      Company name <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={values.company_name}
                      onChange={update("company_name")}
                      autoComplete="organization"
                      required
                      aria-invalid={!!errors.company_name}
                      aria-describedby={errors.company_name ? "company_name-error" : undefined}
                      className={INPUT_CLS}
                    />
                    <FieldError id="company_name-error" message={errors.company_name} />
                  </div>

                  {/* Job role */}
                  <div>
                    <label className="block text-[13.5px] font-semibold text-slate-800 mb-1.5">
                      Job role <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      name="job_role"
                      value={values.job_role}
                      onChange={update("job_role")}
                      autoComplete="organization-title"
                      required
                      aria-invalid={!!errors.job_role}
                      aria-describedby={errors.job_role ? "job_role-error" : undefined}
                      className={INPUT_CLS}
                    />
                    <FieldError id="job_role-error" message={errors.job_role} />
                  </div>

                  {/* Phone number (optional) */}
                  <div>
                    <label className="block text-[13.5px] font-semibold text-slate-800 mb-1.5">
                      Phone number <span className="text-xs font-normal text-slate-400">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={values.phone}
                      onChange={update("phone")}
                      autoComplete="tel"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      className={INPUT_CLS}
                    />
                    <FieldError id="phone-error" message={errors.phone} />
                  </div>

                  {/* Service of interest */}
                  <div>
                    <label className="block text-[13.5px] font-semibold text-slate-800 mb-1.5">
                      Service of interest <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="service_of_interest"
                        value={values.service_of_interest}
                        onChange={update("service_of_interest")}
                        required
                        aria-invalid={!!errors.service_of_interest}
                        aria-describedby={errors.service_of_interest ? "service_of_interest-error" : undefined}
                        className={`${INPUT_CLS} appearance-none pr-10 cursor-pointer ${
                          !values.service_of_interest ? "text-slate-400" : "text-slate-800 font-medium"
                        }`}
                      >
                        <option value="" disabled>
                          Select a service
                        </option>
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="text-slate-800">
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    </div>
                    <FieldError id="service_of_interest-error" message={errors.service_of_interest} />
                  </div>

                  {/* Number of users / sites (optional) */}
                  <div>
                    <label className="block text-[13.5px] font-semibold text-slate-800 mb-1.5">
                      Number of users / sites{" "}
                      <span className="text-xs font-normal text-slate-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="users_or_sites"
                      value={values.users_or_sites}
                      onChange={update("users_or_sites")}
                      placeholder="e.g. 45 users, 2 sites"
                      className={INPUT_CLS}
                    />
                  </div>

                  {/* Project timeline */}
                  <div>
                    <label className="block text-[13.5px] font-semibold text-slate-800 mb-1.5">
                      Project timeline <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="timeline"
                        value={values.timeline}
                        onChange={update("timeline")}
                        required
                        aria-invalid={!!errors.timeline}
                        aria-describedby={errors.timeline ? "timeline-error" : undefined}
                        className={`${INPUT_CLS} appearance-none pr-10 cursor-pointer ${
                          !values.timeline ? "text-slate-400" : "text-slate-800 font-medium"
                        }`}
                      >
                        <option value="" disabled>
                          Select a timeline
                        </option>
                        {TIMELINE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="text-slate-800">
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    </div>
                    <FieldError id="timeline-error" message={errors.timeline} />
                  </div>

                  {/* Short description */}
                  <div>
                    <label className="block text-[13.5px] font-semibold text-slate-800 mb-1.5">
                      Short description <span className="text-red-500 font-bold">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={values.message}
                      onChange={update("message")}
                      required
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "message-error" : undefined}
                      className={`${INPUT_CLS} resize-y`}
                    />
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500">
                      What would you like to improve, and is there a deadline or site visit we should know about?
                    </p>
                    <FieldError id="message-error" message={errors.message} />
                  </div>

                  {/* Captcha Box */}
                  <div>
                    <div
                      className={`flex items-center justify-between rounded-lg border px-4 py-3 bg-[#f8fafc] transition-colors ${
                        errors.captcha ? "border-red-400/80 bg-red-50/25" : "border-slate-200"
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
                                ? "border-slate-300 bg-white"
                                : "border-slate-300 bg-white hover:border-slate-400"
                          }`}
                        >
                          {captchaLoading ? (
                            <span className="size-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                          ) : captchaVerified ? (
                            <Check className="size-4 stroke-[3]" />
                          ) : null}
                        </span>
                        <span className="text-[13.5px] font-medium text-slate-700">I'm not a robot</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#16a34a] select-none">
                        <ShieldCheck className="size-4 text-[#16a34a]" />
                        <span>Protected</span>
                      </div>
                    </div>
                    <FieldError id="captcha-error" message={errors.captcha} />
                  </div>

                  {/* Privacy agreement checkbox */}
                  <div>
                    <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs sm:text-[13px] text-slate-600 leading-snug">
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
                        className="mt-0.5 size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-[#22c55e]"
                      />
                      <span>
                        I agree to be contacted about this enquiry and have read the{" "}
                        <button
                          type="button"
                          onClick={() => setShowPrivacy(true)}
                          className="text-[#16a34a] font-medium underline underline-offset-2 hover:text-[#15803d]"
                        >
                          privacy notice
                        </button>
                        . <span className="text-red-500 font-bold">*</span>
                      </span>
                    </label>
                    <FieldError id="agree_terms-error" message={errors.agree_terms} />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#52c543] hover:bg-[#46b338] active:bg-[#3ba02f] px-6 py-2.5 font-body text-[14.5px] font-semibold text-[#11380e] shadow-sm hover:shadow transition-all duration-200 disabled:opacity-60 disabled:cursor-wait active:scale-[0.99]"
                    >
                      <span>{status === "loading" ? "Sending…" : "Send enquiry"}</span>
                      <ArrowRight className="size-4 text-[#11380e]" />
                    </button>
                  </div>

                  {/* Footer note */}
                  <p className="text-[12px] text-slate-400">
                    Fields marked <span className="text-red-500 font-bold">*</span> are required.
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
                className="rounded-full bg-[#52c543] px-5 py-2 text-xs sm:text-sm font-semibold text-[#11380e] hover:bg-[#46b338]"
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
