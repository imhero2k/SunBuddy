import React from "react";

const TIP_ICONS: Record<
  string,
  { circleClass: string; icon: React.ReactNode }
> = {
  "Use sunscreen": {
    circleClass: "bg-blue-100",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
        <path d="M12 2.2c0 0-4 5.8-4 9.8 0 2.2 1.8 4 4 4s4-1.8 4-4c0-4-4-9.8-4-9.8z" />
      </svg>
    )
  },
  "Wear protective clothing": {
    circleClass: "bg-green-100",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-600">
        {/* T-shirt outline: rounded neck, shoulders, longer sleeves, rectangular body */}
        <path d="M10 5 Q12 7 14 5 L18 5 L18 11 L17 11 L17 20 L7 20 L7 11 L6 11 L6 5 L10 5 Z" />
      </svg>
    )
  },
  "Wear sunglasses": {
    circleClass: "bg-slate-100",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-slate-600">
        <g transform="translate(12, 12) scale(1.35) translate(-12, -9.55)">
          {/* Two downward-facing solid semicircles + solid bridge */}
          <path d="M3 8 L10 8 A 3.5 3.5 0 0 1 3 8 Z" />
          <path d="M14 8 L21 8 A 3.5 3.5 0 0 1 14 8 Z" />
          <path d="M3 7.6 L21 7.6 L21 8.4 L3 8.4 Z" />
        </g>
      </svg>
    )
  },
  "Seek shade": {
    circleClass: "bg-orange-100",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-orange-600">
        {/* Semicircle: curve pointing up (dome), diameter at bottom */}
        <path d="M4 11 L20 11 A 8 8 0 0 0 4 11" />
        {/* Small tip at top of semicircle */}
        <path d="M12 3 L12 1" />
        {/* J from centre of diameter, facing down */}
        <path d="M12 11 V18 Q12 21 9 20" />
      </svg>
    )
  },
  "Time your activities": {
    circleClass: "bg-red-50",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-red-600">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </svg>
    )
  },
  "Protect children": {
    circleClass: "bg-yellow-100",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-600">
        <path d="M12 2L3 6v4c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V6l-9-4zm0 2.2l6 2.7v3.1c0 4.5-3.1 8.9-6 10-2.9-1.1-6-5.5-6-10V6.9l6-2.7z" />
      </svg>
    )
  }
};

// Banner: hands applying sunscreen (single source – no previous images)
const BANNER_IMAGE = `${import.meta.env.BASE_URL}banner-protect-skin.png`;

export const ProtectYourSkinPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <section
        className="relative w-[100vw] left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] h-48 md:h-64 bg-cover flex flex-col justify-center"
        style={{
          backgroundImage: `url(${BANNER_IMAGE})`,
          backgroundPosition: "center 35%"
        }}
      >
        <div className="absolute inset-0 bg-blue-600/40" aria-hidden />
        <div className="max-w-6xl mx-auto w-full px-6 relative z-10">
          <p className="text-xs tracking-wide text-white/90 uppercase drop-shadow-sm">
            Sun protection
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-white mt-1 drop-shadow-md">
            Protect your skin
          </h1>
          <p className="text-sm text-white/95 mt-2 max-w-2xl drop-shadow-sm">
            Practical tips and resources to help you stay safe in the sun.
          </p>
        </div>
      </section>

      {/* 6 Essential Sun Protection Methods — 3x2 grid */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">
          6 Essential Sun Protection Methods
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[
            {
              label: "Use sunscreen",
              points: [
                "Broad-spectrum SPF 30+ (or 50+ for fair skin or high UV).",
                "Reapply every 2 hours and after swimming or sweating.",
                "Apply 20 minutes before going outside.",
                "Use water-resistant formula when swimming."
              ]
            },
            {
              label: "Wear protective clothing",
              points: [
                "Long sleeves, collars, and longer hems reduce UV on skin.",
                "Wide-brim hat (at least 7.5 cm) for face, ears, and neck.",
                "UV-rated fabrics offer extra protection when labelled."
              ]
            },
            {
              label: "Wear sunglasses",
              points: [
                "Wrap-around or close-fitting styles reduce side UV.",
                "Look for AS/NZS or equivalent UV protection labelling.",
                "Protects eyes and the delicate skin around them.",
                "Wear even on cloudy days."
              ]
            },
            {
              label: "Seek shade",
              points: [
                "Especially between 10 am and 3 pm when UV is strongest.",
                "Use trees, umbrellas, shelters, or awnings.",
                "Shade alone is not enough—combine with other measures.",
                "Still use sunscreen in the shade."
              ]
            },
            {
              label: "Time your activities",
              points: [
                "Check the UV index and plan outdoor time around it.",
                "Prefer early morning or late afternoon when UV is lower.",
                "Protect even on cloudy days—UV can still be high.",
                "Be extra cautious near reflective surfaces."
              ]
            },
            {
              label: "Protect children",
              points: [
                "Use child-friendly sunscreen and reapply often.",
                "Keep infants under 6 months out of direct sun.",
                "Dress kids in hats, clothing, and shade when possible.",
                "Teach sun safety from an early age."
              ]
            }
          ].map(({ label, points }) => {
            const { circleClass, icon } = TIP_ICONS[label] ?? {
              circleClass: "bg-slate-100",
              icon: null
            };
            return (
            <div
              key={label}
              className="ios-card rounded-xl p-4 flex flex-col gap-3"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${circleClass}`}
                aria-hidden
              >
                {icon}
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                {label}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                {points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
            );
          })}
        </div>
      </section>

      {/* Choosing the Right Sunscreen */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Choosing the Right Sunscreen
        </h2>
        <article className="ios-card p-4 md:p-5 bg-orange-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <h3 className="text-sm font-semibold text-orange-600 mb-3">What to Look For</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex gap-2">
                  <span className="text-orange-600 shrink-0" aria-hidden>✓</span>
                  <span><strong>Broad Spectrum:</strong> Protects against both UVA and UVB rays</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 shrink-0" aria-hidden>✓</span>
                  <span><strong>SPF 30 or Higher:</strong> Blocks 97% of UVB rays</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 shrink-0" aria-hidden>✓</span>
                  <span><strong>Water Resistant:</strong> For swimming or sweating</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 shrink-0" aria-hidden>✓</span>
                  <span><strong>Non-Comedogenic:</strong> Won&apos;t clog pores</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-orange-600 mb-3">Application Tips</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex gap-2">
                  <span className="text-orange-600 shrink-0" aria-hidden>✓</span>
                  <span>Use 1 ounce (shot glass full) for entire body</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 shrink-0" aria-hidden>✓</span>
                  <span>Apply to dry skin 15–30 minutes before sun exposure</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 shrink-0" aria-hidden>✓</span>
                  <span>Don&apos;t forget ears, neck, feet, and hands</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 shrink-0" aria-hidden>✓</span>
                  <span>Reapply every 2 hours or after swimming/sweating</span>
                </li>
              </ul>
            </div>
          </div>
        </article>
      </section>

      {/* Additional Protection Tips */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Additional Protection Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <article className="ios-card p-4 flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-slate-900">Check Your Skin Regularly</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Perform monthly self-exams to check for new or changing moles. See a dermatologist annually for a professional skin check, especially if you have a history of sun exposure or skin cancer in your family.
            </p>
          </article>
          <article className="ios-card p-4 flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-slate-900">Stay Hydrated</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Drinking plenty of water helps keep your skin healthy and resilient. Proper hydration supports your skin&apos;s natural barrier function and helps it recover from sun exposure.
            </p>
          </article>
          <article className="ios-card p-4 flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-slate-900">Avoid Tanning Beds</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Indoor tanning beds emit harmful UV radiation that can significantly increase your risk of skin cancer. There is no such thing as a &quot;safe tan&quot; from a tanning bed.
            </p>
          </article>
          <article className="ios-card p-4 flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-slate-900">Use Lip Balm with SPF</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Your lips are vulnerable to sun damage too. Use a lip balm with SPF 30 or higher and reapply frequently, especially after eating or drinking.
            </p>
          </article>
        </div>
      </section>

      <p className="text-xs text-slate-500 max-w-2xl">
        Use the <strong>Personalisation</strong> tab to get tailored sunscreen amount and clothing recommendations based on your skin type, activities, and current UV.
      </p>
    </div>
  );
};
