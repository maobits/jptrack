import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import positionsRoutes from "./routes/positionsRoutes.js";

// Cargar variables de entorno
dotenv.config();

// Verificación (opcional pero útil)
if (!process.env.BITACORA_API_URL || !process.env.BITACORA_API_KEY) {
  console.warn(
    "⚠️  Advertencia: BITACORA_API_URL o BITACORA_API_KEY no están definidas."
  );
} else {
  console.log("✅ Variables de entorno cargadas correctamente.");
}

const app = express();

app.use(cors());
app.use(express.json());

// Rutas de posiciones
app.use("/api/positions", positionsRoutes);

export default app;
