## SunBuddy

Minimal UV dashboard web app inspired by the iOS-style widgets in your mockups.

### Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express (TypeScript)
- **Storage**: In-memory stubs with clear extension points for AWS services (e.g. DynamoDB, S3). No AWS SDK wired yet.

### Features

- **Widget dashboard** with cards for:
  - Minimal UV
  - Peak UV
  - Cloud cover
  - Burn risk
  - Sunscreen need
  - Vitamin D
  - UV exposure
  - Location area
- **Bottom navigation bar** similar to the app in your screenshots.
- All **external API URLs are left empty** so you can plug in whatever providers you prefer.

### Getting started

1. Install dependencies:

```bash
npm install
```

2. Run the frontend and backend in parallel:

```bash
npm run dev
```

3. Open the app in your browser at `http://localhost:5173`.

### Environment and configuration

- Copy `.env.example` to `.env` and fill in any values you decide to use.
- API endpoint URLs are intentionally left as empty strings in the backend so you can choose providers later.
- When you are ready to use AWS for storage, you can wire the placeholders in `server/src/storage/awsStorage.ts` to DynamoDB, S3, or other services.

### Scripts

- `npm run dev` – start frontend (Vite) and backend (Express) with `concurrently`
- `npm run dev:client` – start only the Vite dev server
- `npm run dev:server` – start only the Express dev server (port 4000)
- `npm run build` – build frontend and backend
- `npm run lint` – run TypeScript and ESLint (if you add ESLint config)

