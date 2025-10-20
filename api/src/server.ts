import express from "express";
import cors from "cors";
import { json } from "express";
import dotenv from "dotenv";
import { resolve } from "path";

// Ensure env loads from api/.env regardless of CWD
dotenv.config({ path: resolve(__dirname, "../.env") });

// Ensure SQLite path is absolute to avoid EBUSY/ENOENT when CWD differs
const absoluteDbPath = resolve(__dirname, "../prisma/dev.db");
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:./")) {
  process.env.DATABASE_URL = `file:${absoluteDbPath}`;
}

const app = express();
app.use(cors());
app.use(json());

// Import routes AFTER env is configured so Prisma reads correct DATABASE_URL
// eslint-disable-next-line @typescript-eslint/no-var-requires
const customQuestionsRouter = require("./routes/customQuestions").default as import("express").Router;
app.use("/custom-questions", customQuestionsRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(port, () => {
  console.log(`API listening on :${port}`);
});


