// src/controllers/portfolio.controller.js

import axios from "axios";
import { CalculatePortfolioProfitability } from "../utils/calculatePortfolioProfitability.js";
import ObtenerRentabilidadTotalCerradas from "../utils/ObtenerRentabilidadTotalCerradas.js";

/**
 * -----------------------------------------------------------------------------
 * Controlador de portafolio de posiciones JP Tracker
 * Desarrollado por: Mauricio Chara - Maobits
 * Última revisión: 2025-08-03
 * -----------------------------------------------------------------------------
 */

/**
 * Obtener rentabilidad de posiciones abiertas
 */
export const getPortfolioOpen = async (req, res) => {
  console.log("📊 [PORTFOLIO] Posiciones abiertas...");
  const url = `${process.env.BITACORA_API_URL}/api/positions`;

  const result = await CalculatePortfolioProfitability(url);
  if (result.error) return res.status(500).json(result);
  res.json(result);
};

/**
 * Obtener rentabilidad total de posiciones cerradas
 */
export const getPortfolioClosed = async (req, res) => {
  console.log("📊 [PORTFOLIO] Posiciones cerradas...");
  const url = `${process.env.BITACORA_API_URL}/api/positions/closed-positions`;

  try {
    const response = await axios.get(url, {
      headers: { "x-api-key": process.env.BITACORA_API_KEY },
    });

    const positions = response.data?.results || [];

    if (!positions.length) {
      console.warn("⚠️ No se encontraron posiciones cerradas.");
      return res.status(200).json({
        detallePorMes: {},
        rentabilidadTotalCompuesta: 0,
        rentabilidadTotalCompuestaDecimal: 0,
        totalPositions: 0,
      });
    }

    const result = await ObtenerRentabilidadTotalCerradas(positions);

    res.json({
      ...result,
      totalPositions: positions.length,
    });
  } catch (err) {
    console.error("❌ Error al obtener posiciones cerradas:", err.message);
    res.status(500).json({ error: err.message });
  }
};
