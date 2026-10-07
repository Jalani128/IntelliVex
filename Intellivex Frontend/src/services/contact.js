import { api } from "./api";

/* Same limits as the Laravel rules for POST /api/contact (CONTACT_INQUIRIES_API.md). */
export const INQUIRY_RULES = {
  full_name: { max: 120 },
  email: { max: 255 },
  phone: { min: 7, max: 30, pattern: /^[0-9+\-().\s]+$/ },
  subject: { max: 160 },
  message: { min: 10, max: 5000 },
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Client-side check that mirrors the API, so most mistakes show before sending. */
export function validateInquiry(values) {
  const errors = {};
  const v = Object.fromEntries(Object.entries(values).map(([k, val]) => [k, String(val ?? "").trim()]));

  if (!v.full_name) errors.full_name = "Please enter your full name.";
  else if (v.full_name.length > INQUIRY_RULES.full_name.max) errors.full_name = `Name must be ${INQUIRY_RULES.full_name.max} characters or fewer.`;

  if (!v.phone) errors.phone = "Please enter your phone number.";
  else if (!INQUIRY_RULES.phone.pattern.test(v.phone)) errors.phone = "Use digits, spaces and + - ( ) . only.";
  else if (v.phone.length < INQUIRY_RULES.phone.min || v.phone.length > INQUIRY_RULES.phone.max)
    errors.phone = `Phone must be ${INQUIRY_RULES.phone.min}–${INQUIRY_RULES.phone.max} characters.`;

  if (!v.email) errors.email = "Please enter your email.";
  else if (!EMAIL.test(v.email) || v.email.length > INQUIRY_RULES.email.max) errors.email = "Please enter a valid email address.";

  if (!v.subject) errors.subject = "Please enter a subject.";
  else if (v.subject.length > INQUIRY_RULES.subject.max) errors.subject = `Subject must be ${INQUIRY_RULES.subject.max} characters or fewer.`;

  if (!v.message) errors.message = "Please write a message.";
  else if (v.message.length < INQUIRY_RULES.message.min) errors.message = `Message must be at least ${INQUIRY_RULES.message.min} characters.`;
  else if (v.message.length > INQUIRY_RULES.message.max) errors.message = `Message must be ${INQUIRY_RULES.message.max} characters or fewer.`;

  return errors;
}

/**
 * POST /api/contact → 201 { data, message }.
 * Rejects with { message, errors } — `errors` holds the 422 field messages.
 */
export async function submitInquiry(values) {
  const payload = Object.fromEntries(Object.entries(values).map(([k, val]) => [k, String(val ?? "").trim()]));
  try {
    const response = await api.post("contact", payload, { headers: { "Content-Type": "application/json" } });
    return response.data;
  } catch (error) {
    const status = error?.response?.status;
    const body = error?.response?.data;
    const errors = Object.fromEntries(Object.entries(body?.errors ?? {}).map(([field, messages]) => [field, messages[0]]));
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
