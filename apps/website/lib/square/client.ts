let instance: any = null;
let initPromise: Promise<any> | null = null;

function loadSquareScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-square-cdn]");
    if (existing) { resolve(); return; }
    const script = document.createElement("script");
    script.src = src;
    script.setAttribute("data-square-cdn", "1");
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Square.js from CDN."));
    document.head.appendChild(script);
  });
}

export async function getSquarePayments(): Promise<any> {
  if (typeof window === "undefined") return null;
  if (instance) return instance;
  if (!initPromise) {
    const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID ?? "";
    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? "";
    const scriptUrl = appId.startsWith("sandbox-")
      ? "https://sandbox.web.squarecdn.com/v1/square.js"
      : "https://web.squarecdn.com/v1/square.js";
    initPromise = loadSquareScript(scriptUrl)
      .then(() => {
        const Square = (window as any).Square;
        if (!Square) throw new Error("Square.js loaded but window.Square is not available.");
        return Square.payments(appId, locationId);
      })
      .then((p: any) => {
        instance = p;
        return p;
      })
      .catch((err: unknown) => {
        initPromise = null;
        throw err;
      });
  }
  return initPromise;
}
