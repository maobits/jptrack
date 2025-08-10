import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import positionsRoutes from "./routes/positionsRoutes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";
import historyRoutes from "./modules/history/history.routes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger.js";

// ✅ Importar el middleware con el nombre real
import verifyApiKey from "./middleware/verifyApiKey.js";

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
app.use(cors());
app.use(express.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mostrar rutas documentadas
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

// Rutas
app.use("/api/positions", positionsRoutes);
app.use("/api", portfolioRoutes);
app.use("/api/history", verifyApiKey, historyRoutes); // ✅ Nombre corregido

export default app;
