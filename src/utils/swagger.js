// src/utils/swagger.js
import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API de la Bitácora de JP Tactical",
    version: "1.0.0",
    description:
      "Documentación profesional de la API de posiciones y rentabilidad",
    contact: {
      name: "Mauricio Chara - Maobits",
      email: "code@maobits.com",
      url: "https://www.instagram.com/maobits.io",
    },
  },
  servers: [
    {
      url: "https://ttrading.shop:4000/api",
      description: "Servidor en producción",
    },
    {
      url: "http://localhost:4000/api",
      description: "Servidor local",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["src/routes/**/*.js"], // ruta absoluta relativa al root del proyecto
};

export const swaggerSpec = swaggerJsdoc(options);
