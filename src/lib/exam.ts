/**
 * Midterm details. The date is built in the viewer's local time zone, which
 * matches how students read the announced "12:00 PM".
 */
export const midterm = {
  name: "Midterm Examination",
  dateLabel: "Monday, October 26, 2026",
  timeLabel: "12:00 PM",
  date: new Date(2026, 9, 26, 12, 0, 0),
} as const;

export function daysUntil(target: Date, now: Date = new Date()): number {
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.round((startOfDay(target) - startOfDay(now)) / 86_400_000);
}

export function countdownLabel(target: Date, now: Date = new Date()): string {
  if (now.getTime() >= target.getTime()) return "The midterm has started";
  const days = daysUntil(target, now);
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}
