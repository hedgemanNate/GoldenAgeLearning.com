export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export function parseAmount(value: string): number {
  return parseFloat(value.replace(/[^0-9.]/g, ""));
}
