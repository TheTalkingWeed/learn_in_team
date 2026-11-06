// Your web app's Firebase configuration, read from the .env file.
// kept in its own file so server code can read it without initializing the Firebase client SDK.
// NEXT_PUBLIC_ variables are built into the browser code, which Firebase needs to work there.
// Next.js only replaces them when they are written out like this, so don't read them dynamically.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    "Firebase config is missing. Copy .env.example to .env, fill in the NEXT_PUBLIC_FIREBASE_ values and restart the dev server."
  );
}
