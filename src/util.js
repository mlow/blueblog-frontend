import dateAndTime from "date-and-time";
import { encode, decode } from "base64-arraybuffer";

export function formatDate(date, format) {
  return dateAndTime.format(
    date instanceof Date ? date : new Date(date),
    format
  );
}

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
