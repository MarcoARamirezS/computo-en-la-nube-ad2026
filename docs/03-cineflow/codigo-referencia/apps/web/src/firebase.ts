import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const key = import.meta.env.VITE_FIREBASE_API_KEY;
export const auth = key
  ? getAuth(
      initializeApp({
        apiKey: key,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
      }),
    )
  : null;
