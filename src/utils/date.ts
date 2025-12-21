// src/utils/date.ts

function parseDateLike(input: string): Date | null {
  const raw = input.trim();
  if (!raw) return null;

  // Accept: YYYY.MM.DD, YYYY-MM-DD, YYYY/MM/DD
  const m = raw.match(/(\d{4})[./-](\d{1,2})[./-](\d{1,2})/);
  if (!m) return null;

  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  )
    return null;

  // Use midday to avoid edge cases.
  const d = new Date(year, month - 1, day, 12, 0, 0, 0);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function getDateRange(start: Date, end: Date, maxDays = 62): Date[] {
  const result: Date[] = [];
  const s = new Date(start);
  const e = new Date(end);

  s.setHours(12, 0, 0, 0);
  e.setHours(12, 0, 0, 0);

  if (s > e) return [];

  const current = new Date(s);
  let guard = 0;
  while (current <= e) {
    result.push(new Date(current));
    current.setDate(current.getDate() + 1);
    guard += 1;
    if (guard > maxDays) break;
  }
  return result;
}

export function parsePeriodToDates(period: string): Date[] {
  const raw = (period ?? "").trim();
  if (!raw) return [];

  const matches = raw.match(/\d{4}[./-]\d{1,2}[./-]\d{1,2}/g) ?? [];
  const first = matches[0] ? parseDateLike(matches[0]) : null;
  const second = matches[1] ? parseDateLike(matches[1]) : null;

  if (first && second) return getDateRange(first, second);
  if (first) return [first];
  return [];
}

export function formatKoreanDate(date: Date) {
  return date.toLocaleDateString("ko-KR", {
    weekday: "long",
    month: "numeric",
    day: "numeric",
  });
}
