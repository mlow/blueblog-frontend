import {
  base64Encode,
  base64Decode,
  getRandomBytes,
  generateKey,
  deriveKey,
  wrapKey,
  unwrapKey,
  encrypt as _encrypt,
  decrypt as _decrypt,
} from "./webcrypto";

/**
 * @param {string} password the password to derive a new key wrapping key from
 *
 * @returns {{ key_salt: string; wrapped_key: string }} an object containing
 * both the base64 encoded key_salt used to derive the key wrapping key (in
 * combination with `password`) and the base64 encoded wrapped master key.
 */
export async function generateMasterKey(password) {
  return wrapMasterKey(password, await generateKey());
}

/**
 * @param {string} password the password to derive a new key wrapping key from
 * @param {CryptoKey} masterKey the key to wrap
 *
 * @returns {{ key_salt: string; wrapped_key: string }} an object containing
 * both the base64 encoded key_salt used to derive the key wrapping key (in
 * combination with `password`) and the base64 encoded wrapped master key.
 */
export async function wrapMasterKey(password, masterKey) {
  const salt = getRandomBytes(16);
  const derivedKey = await deriveKey(password, salt);
  const wrappedKey = await wrapKey(masterKey, derivedKey);

  return {
    key_salt: base64Encode(salt),
    wrapped_key: base64Encode(wrappedKey),
  };
}

/**
 * @param {string} password password used to derive the unwrapping key
 * @param {string} salt base64 encoded salt used to derive the unwrapping key
 * @param {string} wrappedMasterKey base64 encoded wrapped master key
 *
 * @returns {CryptoKey} the unwrapped "master key", used for document
 * encryption and decryption.
 */
export async function unwrapMasterKey(password, salt, wrappedMasterKey) {
  return unwrapKey(
    base64Decode(wrappedMasterKey),
    await deriveKey(password, base64Decode(salt))
  );
}

const encoder = new TextEncoder();
export async function encrypt(plaintext, key) {
  const iv = getRandomBytes(12);
  return {
    encryption_params: {
      cipher: "AES-256-GCM",
      iv: base64Encode(iv),
    },
    ciphertext: base64Encode(
      await _encrypt(key, iv, encoder.encode(plaintext))
    ),
  };
}

export function decrypt({ encryption_params, ciphertext }, key) {
  return _decrypt(
    key,
    base64Decode(encryption_params.iv),
    base64Decode(ciphertext)
  );
}
