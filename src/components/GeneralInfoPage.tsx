import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import trendsData from "../data/skin-cancer-context-trends.json";

type MetricKey =
  | "count"
  | "crudeRate"
  | "ageStandardisedRate2001"
  | "ageStandardisedRate2025";

const MALE_KEY: Record<MetricKey, string> = {
  count: "maleCount",
  crudeRate: "maleCrudeRate",
  ageStandardisedRate2001: "maleAgeStandardisedRate2001",
  ageStandardisedRate2025: "maleAgeStandardisedRate2025",
};

const FEMALE_KEY: Record<MetricKey, string> = {
  count: "femaleCount",
  crudeRate: "femaleCrudeRate",
  ageStandardisedRate2001: "femaleAgeStandardisedRate2001",
  ageStandardisedRate2025: "femaleAgeStandardisedRate2025",
};

const sources = [
  {
    name: "Australian Institute of Health and Welfare (AIHW)",
    description: "National cancer statistics and skin cancer incidence data.",
    url: "https://www.aihw.gov.au/reports/cancer/cancer-data-in-australia",
  },
  {
    name: "Cancer Australia",
    description: "Skin cancer prevention and early detection guidance.",
    url: "https://www.canceraustralia.gov.au/cancer-types/skin-cancer",
  },
  {
    name: "Cancer Council Australia",
    description:
      "Sun protection guidelines, SunSmart program, and UV resources.",
    url: "https://www.cancer.org.au/cancer-information/causes-and-prevention/sun-safety",
  },
  {
    name: "World Health Organization (WHO) – UV Index",
    description: "Global UV index standards and public health advice.",
    url: "https://www.who.int/news-room/questions-and-answers/item/radiation-the-ultraviolet-(uv)-index",
  },
];

export const GeneralInfoPage: React.FC = () => {
  const [metric, setMetric] = useState<MetricKey>(
    trendsData.defaultMetric as MetricKey
  );

  const activeMetric = trendsData.availableMetrics.find((m) => m.key === metric)!;
  const maleDataKey = MALE_KEY[metric];
  const femaleDataKey = FEMALE_KEY[metric];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-wide text-slate-500 uppercase">
          General information
        </p>
        <h1 className="text-xl font-semibold text-slate-900 mt-1">
          Skin cancer context & trends
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Australia has one of the world&apos;s highest rates of skin cancer. Sun
          protection and early detection remain central public health messages.
        </p>
      </div>

      <article className="ios-card p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Historical melanoma trends (2001–2021)
            </h2>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Australia — by sex
            </p>
          </div>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as MetricKey)}
            className="text-[11px] rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {trendsData.availableMetrics.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendsData.chartData}
              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                width={48}
                tickFormatter={(v) =>
                  metric === "count"
                    ? v >= 1000
                      ? `${(v / 1000).toFixed(0)}k`
                      : v
                    : v
                }
              />
              <Tooltip
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                formatter={(value) => [
                  `${Number(value).toLocaleString()} ${activeMetric.unit}`,
                ]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
              />
              <Line
                type="monotone"
                dataKey={maleDataKey}
                name="Male"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey={femaleDataKey}
                name="Female"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-slate-400 mt-2">
          Source: Australian Institute of Health and Welfare (AIHW).
        </p>
      </article>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <article className="ios-card p-4 md:p-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Why it matters
          </h2>
          <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
            Skin cancer is one of the most common cancer groups in Australia. Most
            cases are linked to UV exposure over a lifetime—so everyday choices in
            the sun add up.
          </p>
          <ul className="mt-3 space-y-2 text-[11px] text-slate-600 list-disc list-inside leading-relaxed">
            <li>
              <strong className="text-slate-800">Scale</strong> — Very large numbers
              of people are treated for skin cancer each year, which affects
              individuals, families, and health systems.
            </li>
            <li>
              <strong className="text-slate-800">UV is preventable</strong> — You
              can&apos;t change past sunburns, but you can reduce UV from here on:
              shade, clothing, hats, sunglasses, and sunscreen when UV is moderate
              or high.
            </li>
            <li>
              <strong className="text-slate-800">Melanoma &amp; other skin cancers</strong>{" "}
              — Melanoma is serious; keratinocyte cancers (e.g. basal and squamous
              cell) are even more common. Both are strongly tied to sun damage.
            </li>
            <li>
              <strong className="text-slate-800">Early detection</strong> — New,
              changing, or non-healing spots are worth a clinical check; earlier
              treatment usually means better outcomes.
            </li>
          </ul>
        </article>
        <article className="ios-card p-4">
          <h2 className="text-sm font-semibold text-slate-900">
            What you can do
          </h2>
          <ul className="mt-2 space-y-2 text-[11px] text-slate-600 list-disc list-inside">
            <li>Slip, slop, slap, seek, slide—especially when UV is 3+.</li>
            <li>Check your skin; see a doctor for new or changing spots.</li>
            <li>Use SunBuddy&apos;s dashboard and personalisation as reminders, not a
              substitute for clinical care.</li>
          </ul>
        </article>
      </div>

      <article className="ios-card p-4 md:p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          Authoritative sources
        </h2>
        <ul className="mt-3 space-y-3">
          {sources.map((s) => (
            <li key={s.name} className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-orange-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.172 13.828a4 4 0 015.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <div>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-orange-500 hover:underline"
                >
                  {s.name}
                </a>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {s.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-[10px] text-slate-400 mt-4">
          SunBuddy does not provide medical advice. For diagnosis or treatment, see
          a qualified health professional.
        </p>
      </article>
    </div>
  );
};
