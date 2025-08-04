import dotenv from "dotenv";
dotenv.config(); // ✅ Cargar variables de entorno

import fs from "fs";
import http from "http";
import https from "https";
import app from "./src/app.js"; // Tu app Express
import path from "path";

// Leer modo de entorno desde ENV o fallback a 'development'
const ENV = process.env.NODE_ENV || "development";
const isProduction = ENV === "production";

// Configuración de puerto y host
const PORT = process.env.PORT || 4000;
const HOST = "0.0.0.0";

if (isProduction) {
  // Certificados SSL para producción (Let's Encrypt)
  const sslOptions = {
    key: fs.readFileSync("/etc/letsencrypt/live/ttrading.shop/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/ttrading.shop/fullchain.pem"),
  };

  https.createServer(sslOptions, app).listen(PORT, HOST, () => {
    console.log(`✅ JPTracker API corriendo en https://ttrading.shop:${PORT}`);
  });
} else {
  // Servidor HTTP para desarrollo
  http.createServer(app).listen(PORT, HOST, () => {
    console.log(`🧪 JPTracker API corriendo en http://localhost:${PORT}`);
  });
}
