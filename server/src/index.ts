import "dotenv/config";
import express from "express";
import cors from "cors";
import { dashboardRouter } from "./routes/dashboard";
import { uvForecastRouter } from "./routes/uvForecast";

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/dashboard", dashboardRouter);
app.use("/api/uv-forecast", uvForecastRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${port}`);
});

