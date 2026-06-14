import app from "../server/app";

// Vercel strips /api from req.url for catch-all api/[...path].ts
// We add it back so Express routing works correctly
export default function handler(req: any, res: any) {
  if (!req.url?.startsWith("/api")) {
    req.url = "/api" + (req.url || "/");
  }
  return app(req, res);
}
