/**
 * -----------------------------------------------------------------------------
 * Personalizado por: Maobits NIT 1061740164
 * Desde: 2025-08-02
 *
 * Desarrollador responsable de la personalización y continuidad del proyecto:
 * Mauricio Chara (https://www.instagram.com/maobits.io)
 *
 * Contacto para soporte:
 * Correo electrónico : code@maobits.com
 * WhatsApp           : +57 3153774638
 * País               : Colombia
 *
 * Descripción del archivo:
 * Rutas para obtener la rentabilidad total del portafolio (abierto o cerrado).
 * Estas rutas están protegidas mediante verificación de clave API y documentadas
 * usando Swagger (OpenAPI 3.0).
 *
 * Versión actual: 1.0
 * Fecha última revisión: 2025-08-02
 * -----------------------------------------------------------------------------
 */

import express from "express";
import {
  getPortfolioOpen,
  getPortfolioClosed,
} from "../controllers/portfolio.controller.js";
import verifyApiKey from "../middleware/verifyApiKey.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Rentabilidad
 *   description: Endpoints para obtener rentabilidad total del portafolio
 */

/**
 * @swagger
 * /portfolio/open:
 *   get:
 *     summary: Obtener rentabilidad total del portafolio abierto
 *     tags: [Rentabilidad]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Rentabilidad total calculada de las posiciones abiertas
 */
router.get("/portfolio/open", verifyApiKey, getPortfolioOpen);

/**
 * @swagger
 * /portfolio/closed:
 *   get:
 *     summary: Obtener rentabilidad total del portafolio cerrado
 *     tags: [Rentabilidad]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Rentabilidad total calculada de las posiciones cerradas
 */
router.get("/portfolio/closed", verifyApiKey, getPortfolioClosed);

export default router;
