import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { generateBusinessPlanWithGemini, generateLocalFallbackPlan } from "./server/planGenerator";
import { UserProfileInput } from "./types";

// Load .env.local if present and GEMINI_API_KEY not set
if (!process.env.GEMINI_API_KEY && fs.existsSync(".env.local")) {
  const envContent = fs.readFileSync(".env.local", "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...vals] = trimmed.split("=");
      if (key && vals.length > 0) {
        process.env[key.trim()] = vals.join("=").trim();
      }
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes go FIRST
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "PLACEHOLDER_API_KEY")
    });
  });

  app.post("/api/generate-plan", async (req, res) => {
    try {
      const input: UserProfileInput = req.body;
      if (!input.industry || !input.primaryChallenge) {
        res.status(400).json({
          success: false,
          error: "業種と現在の悩みは必須項目です。"
        });
        return;
      }

      const plan = await generateBusinessPlanWithGemini(input);
      res.json({
        success: true,
        plan
      });
    } catch (error: any) {
      console.error("Error in /api/generate-plan:", error);
      try {
        const fallback = generateLocalFallbackPlan(req.body);
        res.json({
          success: true,
          plan: fallback
        });
      } catch (fallbackError) {
        res.status(500).json({
          success: false,
          error: "事業計画書の生成中にエラーが発生しました。"
        });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
