// src/utils/swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

// ✅ Normaliza (sin barra final)
const normalize = (u) => (u || "").replace(/\/+$/, "");

const API_KEY_HEADER = process.env.API_KEY_HEADER || "x-api-key";
const PROD_URL = normalize(
  process.env.BITACORA_API_URL || "https://ttrading.shop:4000/api"
);
const DEV_URL = normalize(
  process.env.BITACORA_API_DEV_URL || "http://localhost:4000/api"
);

// ✅ Globs absolutos (evita que Swagger “no vea” modules/**)
const ROOT = process.cwd();
const ROUTES_GLOB = path.join(ROOT, "src", "routes", "**", "*.js");
const MODULES_GLOB = path.join(ROOT, "src", "modules", "**", "*.js");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API de la Bitácora de JP Tactical",
    version: "1.0.0",
    description:
      "Documentación profesional de la API Bitácora JP Tactical, desarrollada y mantenida por Maobits. Acceso seguro a posiciones y rentabilidades, con filtros avanzados.",
    contact: {
      name: "Mauricio Chara - Maobits",
      url: "https://www.maobits.com",
      email: "code@maobits.com",
    },
  },
  servers: [
    { url: PROD_URL, description: "Servidor de producción" },
    { url: DEV_URL, description: "Servidor de desarrollo" },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: API_KEY_HEADER,
      },
    },
  },
  security: [{ ApiKeyAuth: [] }],
};

const options = {
  definition: swaggerDefinition,
  apis: [ROUTES_GLOB, MODULES_GLOB],
};

export const swaggerSpec = swaggerJsdoc(options);
