// server.js
import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import http from "http";
import https from "https";
import mongoose from "mongoose";
import app from "./src/app.js";

const ENV = process.env.NODE_ENV || "development";
const isProduction = ENV === "production";

const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST || "0.0.0.0";
const MONGO_URI = process.env.MONGO_URI; // ej: mongodb://user:pass@127.0.0.1:27017/jp_track_bot?authSource=admin

if (!MONGO_URI) {
  console.error("❌ Falta MONGO_URI en .env");
  process.exit(1);
}

function startServer() {
  if (isProduction) {
    const sslOptions = {
      key: fs.readFileSync("/etc/letsencrypt/live/ttrading.shop/privkey.pem"),
      cert: fs.readFileSync(
        "/etc/letsencrypt/live/ttrading.shop/fullchain.pem"
      ),
    };
    https.createServer(sslOptions, app).listen(PORT, HOST, () => {
      console.log(
        `✅ JPTracker API en https://ttrading.shop:${PORT} (env=${ENV})`
      );
    });
  } else {
    http.createServer(app).listen(PORT, HOST, () => {
      console.log(`🧪 JPTracker API en http://localhost:${PORT} (env=${ENV})`);
    });
  }
}

(async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(MONGO_URI);
    console.log(`✅ Mongo conectado: db=${mongoose.connection.name}`);
    startServer();
  } catch (err) {
    console.error("❌ Error conectando a Mongo:", err?.message || err);
    process.exit(1);
  }
})();

// Cierre ordenado
const shutdown = async (code = 0) => {
  try {
    await mongoose.connection.close();
  } finally {
    process.exit(code);
  }
};
process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
process.on("unhandledRejection", (e) =>
  console.error("unhandledRejection:", e)
);
process.on("uncaughtException", (e) => console.error("uncaughtException:", e));
