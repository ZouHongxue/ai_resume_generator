/**
 * Format a date range for display.
 * - Both dates: "2020-09 – 2024-06"
 * - Only endDate: "2024-06"
 * - Only startDate: "2020-09 – Present"
 * - Neither: ""
 */
export function formatDateRange(
  startDate: string,
  endDate: string,
  presentLabel = 'Present',
): string {
  const s = startDate?.trim();
  const e = endDate?.trim();

  if (s && e) return `${s} – ${e}`;
  if (s && !e) return `${s} – ${presentLabel}`;
  if (!s && e) return e;
  return '';
}
