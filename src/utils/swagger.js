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
    { url: "http://localhost:4000/api", description: "Servidor local" },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-api-key", // Aquí se define claramente el nombre del header
      },
    },
  },
  security: [{ ApiKeyAuth: [] }], // Aplica globalmente a todas las rutas documentadas
};

const options = {
  swaggerDefinition,
  apis: ["src/routes/**/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
