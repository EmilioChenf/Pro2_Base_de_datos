export function formatCurrencyGTQ(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return `Q ${amount.toLocaleString('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
