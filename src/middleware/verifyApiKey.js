// src/middleware/verifyApiKey.js

import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.BITACORA_API_KEY;

/**
 * Middleware para verificar la clave API.
 */
export default function verifyApiKey(req, res, next) {
  const apiKey = req.header("x-api-key");

  if (!apiKey) {
    return res.status(401).json({ error: "Falta la clave API" });
  }

  if (apiKey !== API_KEY) {
    return res.status(403).json({ error: "Clave API inválida" });
  }

  next();
}
