import CryptoJS from "crypto-js";

const KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "lintas-wahana-secret-key-2026";

export function encryptData(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), KEY).toString();
}

export function decryptData(ciphertext) {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch {
    return null;
  }
}

export function saveSecureData(key, data) {
  try {
    const encrypted = encryptData(data);
    if (typeof data === "object" && data !== null) {
      localStorage.setItem(key, encrypted);
    }
  } catch (err) {
    console.error("[Encryption] Failed to save:", key, err.message);
  }
}

export function getSecureData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? decryptData(data) : null;
  } catch {
    return null;
  }
}

export function clearAllSecureStorage() {
  localStorage.clear();
  sessionStorage.clear();
}

export function deleteCookie(name) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function setSecureCookie(name, value, days = 7) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${date.toUTCString()}; SameSite=Lax`;
}
