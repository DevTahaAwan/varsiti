export function parseWeekParam(value: string) {
  if (!/^\d{1,2}$/.test(value)) {
    return null;
  }

  const weekNumber = Number(value);
  if (!Number.isInteger(weekNumber) || weekNumber < 1 || weekNumber > 52) {
    return null;
  }

  return weekNumber;
}