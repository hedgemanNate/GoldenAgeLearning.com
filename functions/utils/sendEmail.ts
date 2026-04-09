import * as functions from "firebase-functions";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const FROM = "The Golden Age Learning Team <noreply@goldenagelearning.com>";

// Lazy singleton — initialized on first call so functions.config() is available at runtime
let _client: SESClient | null = null;

function getClient(): SESClient {
  if (!_client) {
    const cfg = (functions.config().aws ?? {}) as Record<string, string>;
    _client = new SESClient({
      region: cfg.ses_region ?? "us-east-1",
      credentials: {
        accessKeyId: cfg.ses_access_key ?? "",
        secretAccessKey: cfg.ses_secret_key ?? "",
      },
    });
  }
  return _client;
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const command = new SendEmailCommand({
    Source: FROM,
    Destination: { ToAddresses: [params.to] },
    Message: {
      Subject: { Data: params.subject, Charset: "UTF-8" },
      Body: { Html: { Data: params.html, Charset: "UTF-8" } },
    },
  });
  await getClient().send(command);
}
