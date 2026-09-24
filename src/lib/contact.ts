/*
 * Pravila za kontakt formu — jedan fajl koji koriste i browser i server.
 *
 * Browser provjerava da posjetilac odmah vidi šta nije u redu; server
 * provjerava opet, jer se browser može zaobići (svako može poslati zahtjev
 * direktno na /api/contact). Da se dvije provjere ne bi razišle, pravila
 * žive ovdje, na jednom mjestu.
 */

export type ContactField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'interest'
  | 'message'
  | 'consent';

export type ContactErrorCode = 'required' | 'email' | 'phone' | 'tooLong';

export type ContactValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  consent: boolean;
};

export type ContactErrors = Partial<Record<ContactField, ContactErrorCode>>;

/** Redoslijed polja na strani — prvo nevažeće se fokusira. */
export const CONTACT_FIELD_ORDER: ContactField[] = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'interest',
  'message',
  'consent',
];

export const CONTACT_LIMITS = {
  firstName: 60,
  lastName: 60,
  email: 120,
  phone: 25,
  interest: 80,
  message: 2000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()\-./]+$/;

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};

  for (const key of ['firstName', 'lastName', 'email', 'interest'] as const) {
    const value = values[key].trim();
    if (!value) errors[key] = 'required';
    else if (value.length > CONTACT_LIMITS[key]) errors[key] = 'tooLong';
  }

  if (!errors.email && !EMAIL_RE.test(values.email.trim())) errors.email = 'email';

  const phone = values.phone.trim();
  if (phone) {
    if (phone.length > CONTACT_LIMITS.phone) errors.phone = 'tooLong';
    else if (!PHONE_RE.test(phone) || phone.replace(/\D/g, '').length < 6) errors.phone = 'phone';
  }

  if (values.message.trim().length > CONTACT_LIMITS.message) errors.message = 'tooLong';

  if (!values.consent) errors.consent = 'required';

  return errors;
}
