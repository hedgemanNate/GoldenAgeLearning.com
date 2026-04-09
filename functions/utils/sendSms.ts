import * as functions from "firebase-functions";
import twilio from "twilio";

const PREFIX = "Golden Age Learning: ";
const MAX_CHARS = 160;

// Lazy singleton
let _client: ReturnType<typeof twilio> | null = null;

function getClient(): ReturnType<typeof twilio> {
  if (!_client) {
    const cfg = (functions.config().twilio ?? {}) as Record<string, string>;
    _client = twilio(cfg.account_sid ?? "", cfg.auth_token ?? "");
  }
  return _client;
}

function buildBody(message: string): string {
  const full = `${PREFIX}${message}`;
  if (full.length > MAX_CHARS) {
    console.warn(`SMS exceeds 160 chars (${full.length}): ${full}`);
  }
  return full;
}

export async function sendSms(params: {
  to: string;
  message: string;
}): Promise<void> {
  const cfg = (functions.config().twilio ?? {}) as Record<string, string>;
  const from = cfg.from_number ?? "";

  await getClient().messages.create({
    from,
    to: params.to,
    body: buildBody(params.message),
  });
}
