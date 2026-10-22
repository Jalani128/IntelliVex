import { api } from "./api";

/* Validation rules matching backend constraints while supporting the extended inquiry form */
export const INQUIRY_RULES = {
  full_name: { min: 2, max: 120 },
  email: { max: 255 },
  phone: { min: 7, max: 30, pattern: /^[0-9+\-().\s]+$/ },
  company_name: { max: 150 },
  job_role: { max: 120 },
  service_of_interest: { max: 100 },
  timeline: { max: 100 },
  users_or_sites: { max: 100 },
  subject: { max: 160 },
  message: { min: 10, max: 5000 },
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Client-side check that validates all required inquiry fields */
export function validateInquiry(values, { checkCaptcha = true, checkConsent = true } = {}) {
  const errors = {};
  const v = Object.fromEntries(
    Object.entries(values).map(([k, val]) => [k, typeof val === "string" ? val.trim() : val])
  );

  if (!v.full_name) {
    errors.full_name = "Please enter your full name.";
  } else if (v.full_name.length < INQUIRY_RULES.full_name.min) {
    errors.full_name = `Name must be at least ${INQUIRY_RULES.full_name.min} characters.`;
  } else if (v.full_name.length > INQUIRY_RULES.full_name.max) {
    errors.full_name = `Name must be ${INQUIRY_RULES.full_name.max} characters or fewer.`;
  }

  if (!v.email) {
    errors.email = "Please enter your business email.";
  } else if (!EMAIL.test(v.email) || v.email.length > INQUIRY_RULES.email.max) {
    errors.email = "Please enter a valid email address.";
  }

  if (!v.company_name) {
    errors.company_name = "Please enter your company name.";
  } else if (v.company_name.length > INQUIRY_RULES.company_name.max) {
    errors.company_name = `Company name must be ${INQUIRY_RULES.company_name.max} characters or fewer.`;
  }

  if (!v.job_role) {
    errors.job_role = "Please enter your job role.";
  } else if (v.job_role.length > INQUIRY_RULES.job_role.max) {
    errors.job_role = `Job role must be ${INQUIRY_RULES.job_role.max} characters or fewer.`;
  }

  if (v.phone) {
    if (!INQUIRY_RULES.phone.pattern.test(v.phone)) {
      errors.phone = "Use digits, spaces and + - ( ) . only.";
    } else if (v.phone.length < INQUIRY_RULES.phone.min || v.phone.length > INQUIRY_RULES.phone.max) {
      errors.phone = `Phone must be ${INQUIRY_RULES.phone.min}–${INQUIRY_RULES.phone.max} characters.`;
    }
  }

  if (!v.service_of_interest) {
    errors.service_of_interest = "Please select a service of interest.";
  }

  if (!v.timeline) {
    errors.timeline = "Please select a project timeline.";
  }

  if (!v.message) {
    errors.message = "Please enter a short description.";
  } else if (v.message.length < INQUIRY_RULES.message.min) {
    errors.message = `Description must be at least ${INQUIRY_RULES.message.min} characters.`;
  } else if (v.message.length > INQUIRY_RULES.message.max) {
    errors.message = `Description must be ${INQUIRY_RULES.message.max} characters or fewer.`;
  }

  if (checkCaptcha && !values.captchaVerified) {
    errors.captcha = "Please complete the captcha verification.";
  }

  if (checkConsent && !values.agree_terms) {
    errors.agree_terms = "Please agree to the privacy notice to proceed.";
  }

  return errors;
}

/**
 * POST /api/contact → 201 { data, message }.
 * Formats all additional fields into the structured message so they appear
 * in the admin panel and email, while also passing individual fields.
 */
export async function submitInquiry(values) {
  const formattedMessage = [
    `Company: ${values.company_name || "N/A"}`,
    `Job Role: ${values.job_role || "N/A"}`,
    `Service of Interest: ${values.service_of_interest || "N/A"}`,
    `Project Timeline: ${values.timeline || "N/A"}`,
    `Number of Users / Sites: ${values.users_or_sites || "N/A"}`,
    `Phone: ${values.phone || "Not provided"}`,
    "",
    "Short Description:",
    values.message || "",
  ].join("\n");

  const payload = {
    full_name: String(values.full_name ?? "").trim(),
    email: String(values.email ?? "").trim(),
    // Backend validation requires a valid phone; if omitted in optional field, send fallback
    phone: String(values.phone ?? "").trim() || "+00 000 0000",
    subject: values.service_of_interest
      ? `${values.service_of_interest} Inquiry - ${values.company_name || "Client"}`
      : `Consultation Inquiry - ${values.company_name || "Client"}`,
    message: formattedMessage,
    company_name: String(values.company_name ?? "").trim(),
    job_role: String(values.job_role ?? "").trim(),
    service_of_interest: String(values.service_of_interest ?? "").trim(),
    timeline: String(values.timeline ?? "").trim(),
    users_or_sites: String(values.users_or_sites ?? "").trim(),
    description: String(values.message ?? "").trim(),
  };

  try {
    const response = await api.post("contact", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    const status = error?.response?.status;
    const body = error?.response?.data;
    const errors = Object.fromEntries(
      Object.entries(body?.errors ?? {}).map(([field, messages]) => [field, messages[0]])
    );
    const message =
      status === 422
        ? body?.message || "Please check the highlighted fields."
        : status === 429
          ? "Too many requests. Please wait a minute and try again."
          : !error?.response
            ? "We couldn't reach the server. Please check your connection and try again."
            : body?.message || "Something went wrong. Please try again.";
    throw { status, message, errors };
  }
}
