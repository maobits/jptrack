/**
 * -----------------------------------------------------------------------------
 * Historial: controller con 4 endpoints (uno por colección) + filtros/paginación
 * -----------------------------------------------------------------------------
 */
import mongoose from "mongoose";

/* Helpers */
const parseIntOr = (v, d) => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : d;
};

// Si llega dateKey, se usa SOLO ese filtro exacto.
// Si no, se usa rango por takenAt (from/to, YYYY-MM-DD)
function buildDateFilter({ dateKey, from, to }) {
  if (dateKey) return { dateKey };

  const f = {};
  if (from || to) {
    f.takenAt = {};
    if (from) f.takenAt.$gte = new Date(`${from}T00:00:00.000Z`);
    if (to) f.takenAt.$lte = new Date(`${to}T23:59:59.999Z`);
  }
  return f;
}

const ALLOWED_SORTS = new Set([
  "takenAt",
  "dateKey",
  "createdAt",
  "updatedAt",
  "_id",
]);
const sanitizeSort = (key) =>
  ALLOWED_SORTS.has(String(key)) ? String(key) : "takenAt";

/* Generador de handler por colección */
function createListHandler(collectionName) {
  return async (req, res, next) => {
    try {
      // Protección: DB debe estar conectada
      if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
        return res
          .status(503)
          .json({ success: false, error: "Database not connected" });
      }

      const page = parseIntOr(req.query.page, 1);
      const perPage = Math.min(parseIntOr(req.query.perPage, 20), 200);
      const skip = (page - 1) * perPage;

      const sortKey = sanitizeSort(req.query.sort || "takenAt");
      const order =
        (req.query.order || "desc").toLowerCase() === "asc" ? 1 : -1;

      const { dateKey, from, to } = req.query;
      const filter = buildDateFilter({ dateKey, from, to });

      const col = mongoose.connection.db.collection(collectionName);

      const total = await col.countDocuments(filter);
      const results = await col
        .find(filter, { projection: { __v: 0 } })
        .sort({ [sortKey]: order })
        .skip(skip)
        .limit(perPage)
        .toArray();

      res.json({
        success: true,
        meta: {
          collection: collectionName,
          page,
          perPage,
          total,
          totalPages: Math.ceil(total / perPage),
          sort: sortKey,
          order: order === 1 ? "asc" : "desc",
          filter: {
            dateKey: dateKey ?? null,
            from: from ?? null,
            to: to ?? null,
          },
        },
        results,
      });
    } catch (err) {
      next(err);
    }
  };
}

/* 4 handlers públicos (NO usan req.params.collection) */
export const listPortfolioOpen = createListHandler("portfolio_open");
export const listPortfolioClosed = createListHandler("portfolio_closed");
export const listPositionsOpen = createListHandler("positions_open");
export const listPositionsClosed = createListHandler("positions_closed");
