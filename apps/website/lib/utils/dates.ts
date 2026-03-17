export function toUnixTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export function fromUnixTimestamp(ts: number): Date {
  return new Date(ts * 1000);
}

export function formatDate(ts: number, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(fromUnixTimestamp(ts));
}

export function formatDateTime(ts: number): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(fromUnixTimestamp(ts));
}

export function isExpired(expiresAt: number): boolean {
  return toUnixTimestamp(new Date()) > expiresAt;
}

export function nowTimestamp(): number {
  return toUnixTimestamp(new Date());
}
