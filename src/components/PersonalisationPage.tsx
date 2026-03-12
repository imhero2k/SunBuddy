import React from "react";
import { PersonalizationPanel } from "./personalization/PersonalizationPanel";

type Props = {
  currentUv: number;
  peakUvNext24h?: number | null;
};

export const PersonalisationPage: React.FC<Props> = ({
  currentUv,
  peakUvNext24h
}) => {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs tracking-wide text-slate-500 uppercase">
          Personalisation
        </div>
        <div className="text-xl font-semibold text-slate-900 mt-1">
          Recommendations tailored to you
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Select your skin type, sensitivities, and outdoor activity to refine
          advice.
        </div>
      </div>

      <PersonalizationPanel currentUv={currentUv} peakUvNext24h={peakUvNext24h} />
    </div>
  );
};

