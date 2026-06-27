export function getKdColor(kd: number): string {
  if (kd >= 10) return '#EF4444';
  if (kd >= 7) return '#F97316';
  if (kd >= 5) return '#A855F7';
  if (kd >= 3) return '#3B82F6';
  return '#22C55E';
}

export function getKdDot(kd: number): string {
  if (kd >= 10) return '🔴';
  if (kd >= 7) return '🟠';
  if (kd >= 5) return '🟣';
  if (kd >= 3) return '🔵';
  return '🟢';
}

export function formatKd(kd: number): string {
  return kd.toFixed(2);
}
