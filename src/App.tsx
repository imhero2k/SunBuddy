import React, { useEffect, useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { PersonalisationPage } from "./components/PersonalisationPage";
import { GeneralInfoPage } from "./components/GeneralInfoPage";
import { AboutUsPage } from "./components/AboutUsPage";
import { ProtectYourSkinPage } from "./components/ProtectYourSkinPage";
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
  const [tab, setTab] = useState<
    "dashboard" | "personalisation" | "protect" | "general" | "about"
  >("dashboard");
  const [currentUv, setCurrentUv] = useState<number>(0);
  const [peakUv, setPeakUv] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [devPassword, setDevPassword] = useState("");
  const [devError, setDevError] = useState<string | null>(null);

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
      <header className="border-b border-orange-200 bg-card-bg/80 backdrop-blur px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
              SB
            </div>
            <svg
              className="w-6 h-6 text-orange-500 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM12 21a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0V20.25a.75.75 0 01-.75.75zM3.75 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H4.5a.75.75 0 01-.75-.75zM20.25 12a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM5.636 5.636a.75.75 0 011.06 0l1.06 1.061a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM17.243 17.243a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.061l-1.06-1.06a.75.75 0 010-1.06zM5.636 18.364a.75.75 0 010-1.06l1.06-1.06a.75.75 0 111.06 1.06l-1.06 1.06a.75.75 0 01-1.06 0zM17.243 6.757a.75.75 0 010-1.06l1.06-1.06a.75.75 0 111.06 1.06l-1.06 1.06a.75.75 0 01-1.06 0zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
            </svg>
            <div>
              <div className="text-sm font-semibold text-orange-600">
                SunBuddy
              </div>
              <div className="text-xs text-orange-500">
                Sun safety dashboard
              </div>
            </div>
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs text-orange-700 font-medium">
                  {user.displayName || user.email}
                </span>
                <span className="text-[10px] text-orange-500">Signed in</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTab("dashboard")}
                  className={[
                    "px-3 py-1 rounded-full text-xs border",
                    tab === "dashboard"
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-orange-600 border-orange-200"
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
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-orange-600 border-orange-200"
                  ].join(" ")}
                >
                  Personalisation
                </button>
                <button
                  type="button"
                  onClick={() => setTab("protect")}
                  className={[
                    "px-3 py-1 rounded-full text-xs border",
                    tab === "protect"
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-orange-600 border-orange-200"
                  ].join(" ")}
                >
                  Protect your skin
                </button>
                <button
                  type="button"
                  onClick={() => setTab("general")}
                  className={[
                    "px-3 py-1 rounded-full text-xs border",
                    tab === "general"
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-orange-600 border-orange-200"
                  ].join(" ")}
                >
                  General info
                </button>
                <button
                  type="button"
                  onClick={() => setTab("about")}
                  className={[
                    "px-3 py-1 rounded-full text-xs border",
                    tab === "about"
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-orange-600 border-orange-200"
                  ].join(" ")}
                >
                  About us
                </button>
              </div>
              <button
                type="button"
                onClick={() => signOut(auth)}
                className="text-[11px] text-orange-600 underline underline-offset-2 hover:text-orange-700"
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
            ) : tab === "protect" ? (
              <ProtectYourSkinPage />
            ) : tab === "general" ? (
              <GeneralInfoPage />
            ) : (
              <AboutUsPage />
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
              <div className="flex flex-col gap-3 items-stretch w-full max-w-xs">
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
                <form
                  className="mt-2 space-y-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (devPassword === "TA11@123") {
                      setUser({
                        uid: "dev-bypass-user"
                      } as User);
                      setDevError(null);
                    } else {
                      setDevError("Invalid password");
                    }
                  }}
                >
                  <input
                    type="password"
                    placeholder="Password"
                    value={devPassword}
                    onChange={(e) => setDevPassword(e.target.value)}
                    className="w-full rounded-full border border-slate-300 px-3 py-1.5 text-xs"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-1.5 rounded-full border border-dashed border-slate-300 text-xs text-slate-600"
                  >
                    Sign in with password
                  </button>
                  {devError && (
                    <p className="text-[11px] text-red-500 text-center">
                      {devError}
                    </p>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;

