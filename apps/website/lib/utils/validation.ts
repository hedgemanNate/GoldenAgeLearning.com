export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}$/.test(phone);
}

export function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}

export function requireEmailOrPhone(email: string | null, phone: string | null): boolean {
  return Boolean(email || phone);
}
