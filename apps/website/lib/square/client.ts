let instance: any = null;
let initPromise: Promise<any> | null = null;

export async function getSquarePayments(): Promise<any> {
  if (typeof window === "undefined") return null;
  if (instance) return instance;
  if (!initPromise) {
    initPromise = (async () => {
      const { payments } = await import("@square/web-sdk");
      const p = await payments(
        process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID ?? "",
        process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? ""
      );
      instance = p ?? null;
      return instance;
    })();
  }
  return initPromise;
}
