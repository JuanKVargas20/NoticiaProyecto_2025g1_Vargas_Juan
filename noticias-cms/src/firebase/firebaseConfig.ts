import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const cfg = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

console.log("[Firebase] apiKey preview:", cfg.apiKey ? `${String(cfg.apiKey).slice(0,6)}...${String(cfg.apiKey).slice(-6)}` : "undefined");

const app = initializeApp(cfg);
export const auth = getAuth(app);
export const db = getFirestore(app);
if (typeof window !== "undefined" && cfg.measurementId) {
  try { getAnalytics(app); } catch (e) { /* noop */ }
}
