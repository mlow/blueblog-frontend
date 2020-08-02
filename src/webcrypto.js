/**
 * @param {number} length the number bytes to return.
 *
 * @returns {Uint8Array} an array of `length` sized filled with random bytes.
 */
export function getRandomBytes(length) {
  return crypto.getRandomValues(new Uint8Array(length));
}

const deriveKeyParams = {
  name: "PBKDF2",
  hash: "SHA-512",
  iterations: 200000,
};
const generateKeyParams = {
  name: "AES-GCM",
  length: 256,
};
const derivedKeyParams = {
  name: "AES-KW",
  length: 256,
};

const encoder = new TextEncoder();

/**
 * @param {string} password
 * @param {BufferSource} salt
 *
 * @returns a {CryptoKey} which is the result of using PBKDF2 to derive a key
 * from the given `password` and `salt`.
 */
export async function deriveKey(password, salt) {
  return crypto.subtle.deriveKey(
    {
      ...deriveKeyParams,
      salt,
    },
    await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    ),
    derivedKeyParams,
    false,
    ["wrapKey", "unwrapKey"]
  );
}

/**
 * @returns {CryptoKey} a freshly generated crypto key which is extractable and
 * can be used to encrypt or decrypt.
 */
export function generateKey() {
  return crypto.subtle.generateKey(generateKeyParams, true, [
    "encrypt",
    "decrypt",
  ]);
}

/**
 * @param {CryptoKey} toWrap The CryptoKey to wrap.
 * @param {CryptoKey} wrapper The CryptoKey to wrap `toWrap` with.
 *
 * @returns {ArrayBuffer} a Promise which fulfills to the result of wrapping
 * `toWrap` with `wrapper`.
 */
export function wrapKey(toWrap, wrapper) {
  return crypto.subtle.wrapKey("raw", toWrap, wrapper, "AES-KW");
}

/**
 * @param {ArrayBuffer} toUnwrap
 * @param {CryptoKey} unwrapper
 *
 * @returns {CryptoKey} a Promise which fulfilles to the result of unwrapping
 * `toUnwrap` with `unwrapper`. The returned key may only be used for
 * encryption and decryption.
 */
export function unwrapKey(toUnwrap, unwrapper) {
  return crypto.subtle.unwrapKey(
    "raw",
    toUnwrap,
    unwrapper,
    "AES-KW",
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
}

/**
 * @param {CryptoKey} key the key to encrypt with.
 * @param {BufferSource} iv the initialization vector for AES-GCM.
 * @param {BufferSource} plaintext the "plaintext" to encrypt.
 *
 * @returns {ArrayBuffer} a Promise which fulfills with the result of
 * encrypting `plaintext` with `key`.
 */
export function encrypt(key, iv, plaintext) {
  return crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    plaintext
  );
}

/**
 * @param {CryptoKey} key the key to decrypt with.
 * @param {BufferSource} iv the initialzation vector for AES-GCM.
 * @param {BufferSource} ciphertext the "ciphertext" to decrypt.
 *
 * @returns {ArrayBuffer} a Promise which fulfilles with the result of
 * decrypting `ciphertext` with `key`.
 */
export function decrypt(key, iv, ciphertext) {
  return crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    ciphertext
  );
}
