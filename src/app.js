// src/app.js (o index.js)
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import positionsRoutes from "./routes/positionsRoutes.js";

// 🔹 Importar Swagger
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger.js"; // Asegúrate de la ruta correcta

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

// 🔹 Documentación Swagger en /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 🔹 Log útil para confirmar las rutas documentadas
const documentedRoutes = Object.keys(swaggerSpec.paths || {});
if (documentedRoutes.length > 0) {
  console.log("📚 Swagger cargó las siguientes rutas:");
  documentedRoutes.forEach((route) => console.log(` - ${route}`));
} else {
  console.warn("❌ Swagger no detectó rutas definidas.");
}

console.log(
  "🔗 Documentación Swagger disponible en: http://localhost:4000/api-docs"
);

// Rutas de posiciones
app.use("/api/positions", positionsRoutes);

export default app;
