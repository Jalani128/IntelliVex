import { useEffect, useState } from "react";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import DecorSquares from "./DecorSquares";
import { CONSULTATION } from "../data/dataScience";
import { INQUIRY_RULES, submitInquiry, validateInquiry } from "../services/contact";

/* One cluster left of the heading, matching the frame. */
const CONSULT_SHAPES = [
  { className: "left-[3%] top-[8%]", size: 82, drift: 14, duration: 10, delay: 0.3 },
];

const FIELD =
  "w-full rounded-md border border-white/10 bg-white/[0.07] px-4 py-2.5 font-body text-[14px] text-white placeholder:text-white/60 transition-colors duration-300 focus:border-accent focus:outline-none aria-[invalid=true]:border-red-400/70";

const EMPTY = { full_name: "", phone: "", email: "", subject: "", message: "" };

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <span id={id} className="mt-1.5 block font-body text-[12px] text-red-300">
      {message}
    </span>
  );
}

export default function ConsultationSection({ content = CONSULTATION }) {
  const { eyebrow, title, highlight, description, image, contact, address, form } = content;
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
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
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "loading") return;

    const clientErrors = validateInquiry(values);
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
      setNotice(res?.message || "Thank you! Your inquiry has been submitted successfully.");
      setStatus("success");
    } catch (err) {
      setErrors(err.errors ?? {});
      setNotice(err.message);
      setStatus("error");
    }
  };

  return (
    <section id="consultation" className="section-pad-inner relative overflow-hidden bg-navy">
      <DecorSquares shapes={CONSULT_SHAPES} className="hidden lg:block" />

      <div className="container-narrow relative">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_550px] lg:gap-x-[44px]">
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

            {[contact, address].map((block, i) => (
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

          {/* Enquiry form */}
          <Reveal delay={0.24} className="w-full">
            <form
              onSubmit={onSubmit}
              noValidate
              aria-busy={status === "loading"}
              className="rounded-card border border-white/12 bg-white/[0.05] p-6 lg:p-8"
            >
              <h3 className="text-center font-display text-[22px] font-medium text-white lg:text-[24px]">
                {form.title}
              </h3>

              <div aria-live="polite">
                {status === "success" && (
                  <div className="mt-4 rounded-md border border-accent/40 bg-accent/20 px-4 py-3 text-center font-body text-[13px] text-white">
                    {notice}
                  </div>
                )}
                {status === "error" && (
                  <div role="alert" className="mt-4 rounded-md border border-red-400/40 bg-red-500/15 px-4 py-3 text-center font-body text-[13px] text-white">
                    {notice}
                  </div>
                )}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {form.fields.map((field) => (
                  <label key={field.name} className="block">
                    <span className="sr-only">{field.label}</span>
                    <input
                      type={field.type}
                      name={field.name}
                      value={values[field.name]}
                      onChange={update(field.name)}
                      placeholder={field.label}
                      autoComplete={field.autoComplete}
                      maxLength={INQUIRY_RULES[field.name]?.max}
                      required
                      aria-invalid={!!errors[field.name]}
                      aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                      className={FIELD}
                    />
                    <FieldError id={`${field.name}-error`} message={errors[field.name]} />
                  </label>
                ))}
              </div>

              <label className="mt-4 block">
                <span className="sr-only">{form.message}</span>
                <textarea
                  name="message"
                  rows={5}
                  value={values.message}
                  onChange={update("message")}
                  placeholder={form.message}
                  maxLength={INQUIRY_RULES.message.max}
                  required
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={`${FIELD} resize-y`}
                />
                <FieldError id="message-error" message={errors.message} />
              </label>

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-5 w-full rounded-md bg-accent px-6 py-3 font-display text-[15px] font-medium text-white transition-all duration-300 ease-[var(--ease-out-soft)] hover:bg-accent-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft disabled:cursor-wait disabled:opacity-70"
              >
                {status === "loading" ? "Sending…" : form.action}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
