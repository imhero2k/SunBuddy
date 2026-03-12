import admin from "firebase-admin";

function getServiceAccountFromEnv() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as admin.ServiceAccount;
  } catch {
    return null;
  }
}

export function initFirebaseAdmin() {
  if (admin.apps.length > 0) return;

  const svc = getServiceAccountFromEnv();
  if (svc) {
    admin.initializeApp({
      credential: admin.credential.cert(svc)
    });
    // eslint-disable-next-line no-console
    console.log("[auth] Firebase Admin initialised from FIREBASE_SERVICE_ACCOUNT_JSON");
    return;
  }

  // Fallback: Application Default Credentials (e.g. if GOOGLE_APPLICATION_CREDENTIALS is set)
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
    // eslint-disable-next-line no-console
    console.log("[auth] Firebase Admin initialised from application default credentials");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(
      "[auth] Firebase Admin not initialised (missing credentials). Set FIREBASE_SERVICE_ACCOUNT_JSON on Render.",
      err instanceof Error ? err.message : err
    );
  }
}

export { admin };

