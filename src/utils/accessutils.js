import CryptoJS from "crypto-js";

const SECRET_KEY =
  "4363b1c8117514b1596fd692e7eb6dee5f70e75168edc14fa02c25a00f142b1f";

export const saveAccessToken = (token) => {
  const ciphertext = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
  localStorage.setItem("accessToken", ciphertext);
};

export const saveRefreshToken = (token) => {
  const ciphertext = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
  localStorage.setItem("refreshToken", ciphertext);
};

export const saveBMDC = (bmdc) => {
  const ciphertext = CryptoJS.AES.encrypt(bmdc, SECRET_KEY).toString();
  localStorage.setItem("bmdc", ciphertext);
};
export const saveDoctorInfo = (doctorInfo) => {
  const doctorInfoString = JSON.stringify(doctorInfo);
  const ciphertext = CryptoJS.AES.encrypt(
    doctorInfoString,
    SECRET_KEY
  ).toString();
  localStorage.setItem("doctorInfo", ciphertext);
};
const decryptToken = (token) => {
  try {
    const bytes = CryptoJS.AES.decrypt(token, SECRET_KEY);
    const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedToken;
  } catch (e) {
    console.error("Failed to decrypt token:", e);
    return null;
  }
};

export const getAccessToken = () => {
  const encryptedToken = localStorage.getItem("accessToken");
  if (!encryptedToken) return null;

  return decryptToken(encryptedToken);
};

export const getRefreshToken = () => {
  const encryptedToken = localStorage.getItem("refreshToken");
  if (!encryptedToken) return null;

  return decryptToken(encryptedToken);
};

export const getBMDC = () => {
  const encryptedToken = localStorage.getItem("bmdc");
  if (!encryptedToken) return null;

  return decryptToken(encryptedToken);
};
export const getDoctorInfo = () => {
  const encryptedInfo = localStorage.getItem("doctorInfo");
  if (!encryptedInfo) return null;

  const decryptedInfo = decryptToken(encryptedInfo);

  // Case 1: failed decryption → decryptedInfo = null
  if (!decryptedInfo || decryptedInfo.trim() === "") {
    console.warn("doctorInfo decrypt failed or bad data.");
    return null;
  }

  // Case 2: Try to parse JSON safely
  try {
    return JSON.parse(decryptedInfo);
  } catch (err) {
    console.error("Failed to parse decrypted doctorInfo:", err);
    return null;
  }
};

export const clearAccessToken = () => {
  localStorage.removeItem("accessToken");
};

export const clearRefreshToken = () => {
  localStorage.removeItem("refreshToken");
};

export const clearBMDC = () => {
  localStorage.removeItem("bmdc");
};
