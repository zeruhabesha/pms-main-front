import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.REACT_APP_CRYPTO_SECRET_KEY || 'e0b4d1f4c1b26e8d6b03b08c8b8a97e1f7f2a9d5e6a5d89f9a5b6f8b7f3d2e8c';

export const encryptData = (data) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

export const decryptData = (encryptedData) => {
  try {
    if (!encryptedData) return null;
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};