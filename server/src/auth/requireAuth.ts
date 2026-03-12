import type { RequestHandler } from "express";
import { admin, initFirebaseAdmin } from "./firebaseAdmin";

export const requireAuth: RequestHandler = async (req, res, next) => {
  initFirebaseAdmin();

  const header = req.header("authorization") || req.header("Authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  const token = match?.[1];

  if (!token) {
    res.status(401).json({ error: "Missing Authorization Bearer token" });
    return;
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      error: "Invalid or expired token",
      message: err instanceof Error ? err.message : String(err)
    });
  }
};

