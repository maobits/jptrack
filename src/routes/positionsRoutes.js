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
 * Rutas para obtener posiciones abiertas, cerradas y filtradas del portafolio
 * Estas rutas se documentan usando Swagger (OpenAPI 3.0).
 *
 * Versión actual: 1.1
 * Fecha última revisión: 2025-08-02
 * -----------------------------------------------------------------------------
 */

import express from "express";
import {
  getOpenPositions,
  getClosedPositions,
  getClosedPositionsWithFilter,
} from "../controllers/positionsController.js";
import { verifyApiKey } from "../middleware/verifyApiKey.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posiciones
 *   description: Endpoints para gestionar posiciones en JPTracker
 */

/**
 * @swagger
 * /positions/open:
 *   get:
 *     summary: Obtener posiciones abiertas
 *     tags: [Posiciones]
 *     responses:
 *       200:
 *         description: Lista de posiciones abiertas enriquecidas
 *       403:
 *         description: Acceso denegado - API Key inválida
 */
router.get("/open", verifyApiKey, getOpenPositions);

/**
 * @swagger
 * /positions/closed:
 *   get:
 *     summary: Obtener posiciones cerradas
 *     tags: [Posiciones]
 *     responses:
 *       200:
 *         description: Lista de posiciones cerradas enriquecidas
 *       403:
 *         description: Acceso denegado - API Key inválida
 */
router.get("/closed", verifyApiKey, getClosedPositions);

/**
 * @swagger
 * /positions/closed-with-filter:
 *   get:
 *     summary: Obtener posiciones cerradas con filtro por meses
 *     tags: [Posiciones]
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *         required: false
 *         description: Número de meses hacia atrás para filtrar posiciones (por defecto 13)
 *     responses:
 *       200:
 *         description: Lista de posiciones cerradas filtradas por antigüedad
 *       403:
 *         description: Acceso denegado - API Key inválida
 */
router.get("/closed-with-filter", verifyApiKey, getClosedPositionsWithFilter);

export default router;
