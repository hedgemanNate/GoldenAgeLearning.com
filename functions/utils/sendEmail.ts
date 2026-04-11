import * as functions from "firebase-functions";
import { Resend } from "resend";

const FROM = "The Golden Age Learning Team <noreply@goldenagelearning.com>";

let _client: Resend | null = null;

function getClient(): Resend {
  if (!_client) {
    const apiKey = (functions.config().resend as { api_key: string }).api_key;
    _client = new Resend(apiKey);
  }
  return _client;
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const { error } = await getClient().emails.send({
    from: FROM,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });
  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}
