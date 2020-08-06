import { encode, decode } from "base64-arraybuffer";

const month = Intl.DateTimeFormat(undefined, { month: "long" });
const longDate = Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const longDateWithWeek = Intl.DateTimeFormat(undefined, {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});
const shortDateAndTime = Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
});

export const locale = {
  month: (date) => month.format(_toDate(date)),
  longDate: (date) => longDate.format(_toDate(date)),
  longDateWithWeek: (date) => longDateWithWeek.format(_toDate(date)),
  shortDateAndTime: (date) => shortDateAndTime.format(_toDate(date)),
};

const _toDate = (date) => (date instanceof Date ? date : new Date(date));

/**
 * @param {string} base64 the base64 encoded string of data to decode.
 *
 * @returns {Uint8Array} the decoded bytes.
 */
export function base64Decode(base64) {
  return new Uint8Array(decode(base64));
}

/**
 * @param {BufferSource} data
 *
 * @returns {string} base64 encoded string of `data`.
 */
export function base64Encode(data) {
  return encode(data);
}
