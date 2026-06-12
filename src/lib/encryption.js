// lib/encryption.js
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "lintas-wahana-secret-key-2026";

// Enkripsi data
export const encryptData = (data) => {
  try {
    if (!data) return null;
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
};

// Dekripsi data
export const decryptData = (encryptedData) => {
  try {
    if (!encryptedData) return null;
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) return null;
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

// Hapus semua data di storage
export const clearAllSecureStorage = () => {
  // Hapus localStorage
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes("auth") || key.includes("token") || key.includes("user") || key.includes("secure"))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  // Hapus sessionStorage
  const sessionKeysToRemove = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && (key.includes("auth") || key.includes("token") || key.includes("user") || key.includes("secure"))) {
      sessionKeysToRemove.push(key);
    }
  }
  sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
  
  // Hapus semua cookie
  document.cookie.split(";").forEach(cookie => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=localhost";
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=.localhost";
  });
};

// Simpan data terenkripsi ke sessionStorage
export const saveSecureData = (key, data) => {
  try {
    const encrypted = encryptData(data);
    if (encrypted) {
      sessionStorage.setItem(`secure_${key}`, encrypted);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Save secure data error:", error);
    return false;
  }
};

// Ambil data terenkripsi dari sessionStorage
export const getSecureData = (key) => {
  try {
    const encrypted = sessionStorage.getItem(`secure_${key}`);
    if (!encrypted) return null;
    return decryptData(encrypted);
  } catch (error) {
    console.error("Get secure data error:", error);
    return null;
  }
};

// Simpan token ke cookie dengan enkripsi
export const setSecureCookie = (name, value, days = 7) => {
  const encrypted = encryptData(value);
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encrypted}; expires=${expires}; path=/; SameSite=Lax; ${window.location.protocol === 'https:' ? 'Secure;' : ''}`;
};

// Hapus cookie
export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};