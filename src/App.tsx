import React, { useEffect, useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { PersonalisationPage } from "./components/PersonalisationPage";
import { GeneralInfoPage } from "./components/GeneralInfoPage";
import { auth } from "./firebase";
import { apiFetch } from "./api";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User
} from "firebase/auth";

const App: React.FC = () => {
  const [tab, setTab] = useState<"dashboard" | "personalisation" | "general">(
    "dashboard"
  );
  const [currentUv, setCurrentUv] = useState<number>(0);
  const [peakUv, setPeakUv] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // Track auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Fetch dashboard values when user signs in (for Personalisation tab).
  useEffect(() => {
    const run = async () => {
      if (!user) return;
      try {
        const res = await apiFetch(
          `${import.meta.env.VITE_API_BASE ?? "/api"}/dashboard`
        );
        if (!res.ok) return;
        const json = (await res.json()) as { minimalUv?: number };
        setCurrentUv(typeof json.minimalUv === "number" ? json.minimalUv : 0);
      } catch {
        // ignore
      }
    };
    run();
  }, [user]);

  // Note: dashboard values are fetched after sign-in.

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-white/60 bg-card-bg/80 backdrop-blur px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-sm font-semibold">
              SB
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                SunBuddy
              </div>
              <div className="text-xs text-slate-500">
                Sun safety dashboard
              </div>
            </div>
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs text-slate-900 font-medium">
                  {user.displayName || user.email}
                </span>
                <span className="text-[10px] text-slate-500">Signed in</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTab("dashboard")}
                  className={[
                    "px-3 py-1 rounded-full text-xs border",
                    tab === "dashboard"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200"
                  ].join(" ")}
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => setTab("personalisation")}
                  className={[
                    "px-3 py-1 rounded-full text-xs border",
                    tab === "personalisation"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200"
                  ].join(" ")}
                >
                  Personalisation
                </button>
                <button
                  type="button"
                  onClick={() => setTab("general")}
                  className={[
                    "px-3 py-1 rounded-full text-xs border",
                    tab === "general"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200"
                  ].join(" ")}
                >
                  General info
                </button>
              </div>
              <button
                type="button"
                onClick={() => signOut(auth)}
                className="text-[11px] text-slate-500 underline underline-offset-2"
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto w-full px-6 py-6">
          {!authReady ? (
            <div className="text-xs text-slate-500">Checking sign-in…</div>
          ) : user ? (
            tab === "dashboard" ? (
              <Dashboard />
            ) : tab === "personalisation" ? (
              <PersonalisationPage
                currentUv={currentUv}
                peakUvNext24h={peakUv}
              />
            ) : (
              <GeneralInfoPage />
            )
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="space-y-1 text-center max-w-md">
                <div className="text-lg font-semibold text-slate-900">
                  Sign in to use SunBuddy
                </div>
                <div className="text-xs text-slate-500">
                  We use Firebase Authentication to keep this dashboard
                  available only to authorised users.
                </div>
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm shadow-soft"
                onClick={async () => {
                  try {
                    const provider = new GoogleAuthProvider();
                    await signInWithPopup(auth, provider);
                  } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error("Sign-in failed", err);
                    alert("Sign-in failed. Please try again.");
                  }
                }}
              >
                Continue with Google
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;

