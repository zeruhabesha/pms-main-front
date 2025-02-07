export const formatCurrency = (amount, currency = "ETB") => {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency,
  }).format(amount);
};
