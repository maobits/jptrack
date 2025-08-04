// src/utils/swagger.js
import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API de la Bitácora de JP Tactical",
    version: "1.0.0",
    description:
      "Documentación profesional de la API Bitácora JP Tactical, desarrollada y mantenida por Maobits. Esta API ofrece acceso seguro, estructurado y confiable a posiciones abiertas y cerradas de trading, además de capacidades avanzadas de filtrado para una gestión efectiva del portafolio.",
    contact: {
      name: "Mauricio Chara - Maobits",
      url: "https://www.maobits.com",
    },
  },
  servers: [
    {
      url: "http://localhost:4000/api",
      description: "Servidor local",
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-api-key",
      },
    },
  },
  security: [
    {
      ApiKeyAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["src/routes/**/*.js"], // ← rutas que contienen los comentarios Swagger
};

export const swaggerSpec = swaggerJsdoc(options);
