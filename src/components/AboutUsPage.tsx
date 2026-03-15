import React from "react";

// Beach with wooden armchairs – cropped to wide banner (e.g. 3:1)
const BANNER_IMAGE =
  "https://images.unsplash.com/photo-1586696507508-21a5b51b1284?w=1200&h=400&fit=crop&q=80";

export const AboutUsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <section
        className="relative w-[100vw] left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] h-48 md:h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${BANNER_IMAGE})` }}
      >
        <div className="absolute inset-0 bg-orange-600/55 flex flex-col justify-center">
          <div className="max-w-6xl mx-auto w-full px-6">
            <p className="text-xs tracking-wide text-white/90 uppercase">
              About us
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-white mt-1">
              SunBuddy
            </h1>
            <p className="text-sm text-white/95 mt-2 max-w-2xl">
              A sun-safety dashboard to help you understand UV exposure and
              tailor protection to your skin, activities, and location.
            </p>
          </div>
        </div>
      </section>

      <article className="ios-card p-4 md:p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          Our story
        </h2>
        <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
          SunBuddy was founded with a simple goal: to make sun safety accessible
          and easy to understand for everyone. We noticed that while many people
          understand the importance of sun protection, they often lack the
          detailed information needed to make informed decisions.
        </p>
        <p className="text-[11px] text-slate-600 mt-3 leading-relaxed">
          Whether you&apos;re a beach enthusiast, an outdoor worker, or simply
          someone who wants to take better care of their skin, SunBuddy is here
          to guide you every step of the way.
        </p>
      </article>

      <article className="ios-card p-4 md:p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          Our mission
        </h2>
        <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
          SunBuddy aims to make sun protection easier by combining location-based
          UV data with personalised recommendations—so you can enjoy the outdoors
          while reducing your risk of skin damage. This is not medical advice; we
          encourage regular skin checks and following guidance from your doctor or
          the Cancer Council.
        </p>
      </article>

      <article className="ios-card p-4 md:p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">
          What we offer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="flex flex-col items-center text-center">
            <div
              className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-3"
              aria-hidden="true"
            >
              <svg
                className="w-7 h-7 text-orange-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM12 21a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0V20.25a.75.75 0 01-.75.75zM3.75 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H4.5a.75.75 0 01-.75-.75zM20.25 12a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM5.636 5.636a.75.75 0 011.06 0l1.06 1.061a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM17.243 17.243a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.061l-1.06-1.06a.75.75 0 010-1.06zM5.636 18.364a.75.75 0 010-1.06l1.06-1.06a.75.75 0 111.06 1.06l-1.06 1.06a.75.75 0 01-1.06 0zM17.243 6.757a.75.75 0 010-1.06l1.06-1.06a.75.75 0 111.06 1.06l-1.06 1.06a.75.75 0 01-1.06 0zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Education
            </h3>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Learn about UV radiation and its effects on your skin
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div
              className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-3"
              aria-hidden="true"
            >
              <svg
                className="w-7 h-7 text-orange-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 1.5L3 5.25v4.5c0 5.25 3.75 10.5 9 12 5.25-1.5 9-6.75 9-12v-4.5L12 1.5zM12 3.31l6.75 3.09v4.12c0 4.28-3.06 8.94-6.75 10.44-3.69-1.5-6.75-6.16-6.75-10.44V6.4L12 3.31z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Protection
            </h3>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Discover the best ways to protect yourself from harmful rays
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div
              className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-3"
              aria-hidden="true"
            >
              <svg
                className="w-7 h-7 text-orange-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Wellness
            </h3>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Maintain healthy, beautiful skin for years to come
            </p>
          </div>
        </div>
      </article>
    </div>
  );
};
