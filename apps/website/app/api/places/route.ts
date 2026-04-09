import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  if (!input || typeof input !== "string" || input.trim().length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Places API not configured" }, { status: 500 });
  }

  const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
    },
    body: JSON.stringify({
      input: input.trim(),
      languageCode: "en",
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ suggestions: [] }, { status: res.status });
  }

  const data = await res.json();

  const suggestions = (data.suggestions ?? []).map((s: {
    placePrediction?: {
      placeId?: string;
      structuredFormat?: {
        mainText?: { text?: string };
        secondaryText?: { text?: string };
      };
      text?: { text?: string };
    };
  }) => {
    const pp = s.placePrediction;
    const main = pp?.structuredFormat?.mainText?.text ?? "";
    const secondary = pp?.structuredFormat?.secondaryText?.text ?? "";
    const full = pp?.text?.text ?? "";
    return {
      placeId: pp?.placeId ?? "",
      main,
      secondary,
      value: main && secondary ? `${main}, ${secondary}` : full,
    };
  });

  return NextResponse.json({ suggestions });
}
