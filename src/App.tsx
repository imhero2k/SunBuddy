import React from "react";
import { Dashboard } from "./components/Dashboard";

const App: React.FC = () => {
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
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <button className="ios-card px-3 py-1 flex items-center justify-center text-xs">
              <span>＋</span>
            </button>
            <button className="w-8 h-8 rounded-full ios-card flex items-center justify-center">
              👤
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto w-full px-6 py-6">
          <Dashboard />
        </div>
      </main>
    </div>
  );
};

export default App;

