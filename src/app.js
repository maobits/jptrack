// src/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import positionsRoutes from "./routes/positionsRoutes.js";
import portfolioRoutes from "./routes/portfolio.routes.js"; // ✅ NUEVO: Rutas de rentabilidad

// 🔹 Importar Swagger
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger.js";

// 🔹 Cargar variables de entorno
dotenv.config();

// Verificación de variables críticas
if (!process.env.BITACORA_API_URL || !process.env.BITACORA_API_KEY) {
  console.warn(
    "⚠️  Advertencia: BITACORA_API_URL o BITACORA_API_KEY no están definidas."
  );
} else {
  console.log("✅ Variables de entorno cargadas correctamente.");
}

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// 🔹 Documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 🔹 Mostrar rutas documentadas por Swagger
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

// Rutas principales
app.use("/api/positions", positionsRoutes); // ✅ Posiciones
app.use("/api", portfolioRoutes); // ✅ Rentabilidad

export default app;
