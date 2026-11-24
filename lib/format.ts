/** تاريخ عربي بأرقام لاتينية، مثل «8 نوفمبر 2025». */
export function formatDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("ar-SA-u-nu-latn-ca-gregory", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}
