import dateAndTime from "date-and-time";

export function formatDate(date, format) {
  return dateAndTime.format(
    date instanceof Date ? date : new Date(date),
    format
  );
}
