/**
 * -----------------------------------------------------------------------------
 * Historial: 4 endpoints (uno por colección) con filtros/paginación
 * -----------------------------------------------------------------------------
 */
import { Router } from "express";
import {
  listPortfolioOpen,
  listPortfolioClosed,
  listPositionsOpen,
  listPositionsClosed,
} from "./history.controller.js";

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Historial
 *     description: Consultas históricas en MongoDB con filtros y paginación.
 */

/**
 * @openapi
 * /history/portfolio_open:
 *   get:
 *     tags: [Historial]
 *     summary: Listar snapshots del portafolio abierto
 *     security: [ { ApiKeyAuth: [] } ]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: perPage
 *         schema: { type: integer, default: 20, maximum: 200 }
 *       - in: query
 *         name: dateKey
 *         description: Fecha exacta YYYY-MM-DD
 *         schema: { type: string, example: "2025-08-09" }
 *       - in: query
 *         name: from
 *         description: Desde (YYYY-MM-DD) por takenAt
 *         schema: { type: string, example: "2025-08-01" }
 *       - in: query
 *         name: to
 *         description: Hasta (YYYY-MM-DD) por takenAt
 *         schema: { type: string, example: "2025-08-10" }
 *       - in: query
 *         name: sort
 *         schema: { type: string, default: "takenAt", enum: [takenAt, dateKey, createdAt, updatedAt, _id] }
 *       - in: query
 *         name: order
 *         schema: { type: string, default: "desc", enum: [asc, desc] }
 *     responses:
 *       200: { description: OK }
 */
router.get("/portfolio_open", listPortfolioOpen);

/**
 * @openapi
 * /history/portfolio_closed:
 *   get:
 *     tags: [Historial]
 *     summary: Listar snapshots del portafolio cerrado
 *     security: [ { ApiKeyAuth: [] } ]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: perPage
 *         schema: { type: integer, default: 20, maximum: 200 }
 *       - in: query
 *         name: dateKey
 *         schema: { type: string, example: "2025-08-09" }
 *       - in: query
 *         name: from
 *         schema: { type: string, example: "2025-08-01" }
 *       - in: query
 *         name: to
 *         schema: { type: string, example: "2025-08-10" }
 *       - in: query
 *         name: sort
 *         schema: { type: string, default: "takenAt", enum: [takenAt, dateKey, createdAt, updatedAt, _id] }
 *       - in: query
 *         name: order
 *         schema: { type: string, default: "desc", enum: [asc, desc] }
 *     responses:
 *       200: { description: OK }
 */
router.get("/portfolio_closed", listPortfolioClosed);

/**
 * @openapi
 * /history/positions_open:
 *   get:
 *     tags: [Historial]
 *     summary: Listar snapshots de posiciones abiertas
 *     security: [ { ApiKeyAuth: [] } ]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: perPage
 *         schema: { type: integer, default: 20, maximum: 200 }
 *       - in: query
 *         name: dateKey
 *         schema: { type: string, example: "2025-08-09" }
 *       - in: query
 *         name: from
 *         schema: { type: string, example: "2025-08-01" }
 *       - in: query
 *         name: to
 *         schema: { type: string, example: "2025-08-10" }
 *       - in: query
 *         name: sort
 *         schema: { type: string, default: "takenAt", enum: [takenAt, dateKey, createdAt, updatedAt, _id] }
 *       - in: query
 *         name: order
 *         schema: { type: string, default: "desc", enum: [asc, desc] }
 *     responses:
 *       200: { description: OK }
 */
router.get("/positions_open", listPositionsOpen);

/**
 * @openapi
 * /history/positions_closed:
 *   get:
 *     tags: [Historial]
 *     summary: Listar snapshots de posiciones cerradas
 *     security: [ { ApiKeyAuth: [] } ]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: perPage
 *         schema: { type: integer, default: 20, maximum: 200 }
 *       - in: query
 *         name: dateKey
 *         schema: { type: string, example: "2025-08-09" }
 *       - in: query
 *         name: from
 *         schema: { type: string, example: "2025-08-01" }
 *       - in: query
 *         name: to
 *         schema: { type: string, example: "2025-08-10" }
 *       - in: query
 *         name: sort
 *         schema: { type: string, default: "takenAt", enum: [takenAt, dateKey, createdAt, updatedAt, _id] }
 *       - in: query
 *         name: order
 *         schema: { type: string, default: "desc", enum: [asc, desc] }
 *     responses:
 *       200: { description: OK }
 */
router.get("/positions_closed", listPositionsClosed);

export default router;
