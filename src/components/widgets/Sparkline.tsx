import React from "react";

function uvToColor(uv: number): string {
  if (uv < 2) return "#fed7aa";
  if (uv < 5) return "#fb923c";
  if (uv < 7) return "#ea580c";
  return "#c2410c";
}

type Props = {
  values: number[];
  width?: number;
  height?: number;
};

export const Sparkline: React.FC<Props> = ({
  values,
  width = 220,
  height = 46
}) => {
  if (values.length < 2) {
    return null;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1e-6, max - min);

  const pad = 4;
  const w = width;
  const h = height;

  const xStep = (w - pad * 2) / (values.length - 1);

  const points = values.map((v, i) => {
    const x = pad + i * xStep;
    const y = pad + (h - pad * 2) * (1 - (v - min) / range);
    return [x, y, v] as const;
  });

  const d =
    "M " + points.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L ");

  const area =
    `${d} L ${points[points.length - 1][0].toFixed(2)} ${(h - pad).toFixed(2)} L ${points[0][0].toFixed(2)} ${(h - pad).toFixed(2)} Z`;

  const segments = points.slice(0, -1).map((_, i) => {
    const [x1, y1, v1] = points[i];
    const [x2, y2, v2] = points[i + 1];
    const avgUv = (v1 + v2) / 2;
    const color = uvToColor(avgUv);
    return { d: `M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)}`, color };
  });

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${w} ${h}`}
      className="mt-2"
      aria-label="UV forecast by intensity"
      role="img"
    >
      <defs>
        <linearGradient id="uvAreaOrange" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(249,115,22,0.2)" />
          <stop offset="100%" stopColor="rgba(249,115,22,0.02)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#uvAreaOrange)" stroke="none" />
      {segments.map((seg, i) => (
        <path
          key={i}
          d={seg.d}
          fill="none"
          stroke={seg.color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
};

