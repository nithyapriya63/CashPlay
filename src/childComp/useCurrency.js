import { useStoreSettings } from "src/stores/storeSettings";

const storeSettings = useStoreSettings();

export function useCurrency(amount) {
  // currency formatting with '+' and '-'
  let PosNegSymbol = "";
  if (amount > 0) PosNegSymbol = "+";
  else if (amount < 0) PosNegSymbol = "-";

  const currencySymbol = storeSettings.settings.currencySymbol,
    amountPositive = Math.abs(amount),
    amountFormatted = amountPositive.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  return `${PosNegSymbol}${currencySymbol}${amountFormatted}`;
}
