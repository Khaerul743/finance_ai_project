// Fungsi untuk menghitung persentase dan membatasi hasil antara -100 dan 100
export function clampPercent(numerator, denominator) {
  if (!denominator || denominator === 0) return numerator > 0 ? 100 : 0;
  const percent = Math.round((numerator / denominator) * 100);
  return Math.max(-100, Math.min(100, percent));
}
