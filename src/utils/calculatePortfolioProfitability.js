/**
 * -----------------------------------------------------------------------------
 * Personalizado por: Maobits NIT 1061740164
 * Desde: 2025-08-02
 *
 * Desarrollador responsable: Mauricio Chara (https://www.instagram.com/maobits.io)
 * Contacto: code@maobits.com
 *
 * Descripción del archivo:
 * Servicio reutilizable para calcular la rentabilidad total del portafolio
 * a partir de posiciones recibidas desde la Bitácora. Se utiliza desde
 * controladores como `portfolio.controller.js` (para posiciones abiertas o cerradas).
 *
 * Versión actual: 1.2
 * Fecha última revisión: 2025-08-03
 *
 * -----------------------------------------------------------------------------
 */

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Configuración base
const BASE_URL = process.env.BITACORA_API_URL;
const API_KEY = process.env.BITACORA_API_KEY;
const CALCULATOR_URL =
  process.env.CALCULATOR_PORTFOLIO_URL ||
  "http://localhost:3600/portfolio-profitability";
//"https://ttrading.shop:3600/portfolio-profitability";

// Log de configuración activa
console.log("📦 Configuración cargada:");
console.log(" - BITACORA_API_URL:", BASE_URL);
console.log(" - BITACORA_API_KEY:", API_KEY ? "(definida)" : "(no definida)");
console.log(" - CALCULATOR_URL:", CALCULATOR_URL);

// Función principal
export async function CalculatePortfolioProfitability(endpointUrl) {
  try {
    console.log("📡 Consultando posiciones en:", endpointUrl);

    const response = await axios.get(endpointUrl, {
      headers: { "x-api-key": API_KEY },
    });

    const positions = response.data?.results || [];

    if (positions.length === 0) {
      console.warn("⚠️ No se encontraron posiciones para procesar.");
      return { totalPositions: 0, rentabilidadTotal: [] };
    }

    console.log(`📥 Se obtuvieron ${positions.length} posiciones.`);

    const processed = positions.map((pos, i) => {
      console.log(`🔄 Parseando posición #${i + 1}: ${pos.Symbol}`);

      const priceEntries = JSON.parse(pos.PriceEntry || "[]");
      const activeAllocations = JSON.parse(pos.ActiveAllocation || "[]");

      // Buscar entrada inicial válida
      const entryInicial =
        priceEntries.find((e) => !e.type || e.type === "entry") ||
        priceEntries.find((e) => e.id === 1) ||
        priceEntries[0];

      const precioEntrada = parseFloat(entryInicial?.price || "0");

      const transacciones = priceEntries
        .filter((e) => e.id !== entryInicial?.id)
        .map((entry) => {
          const alloc = activeAllocations.find((a) => a.id === entry.id);
          if (!alloc) return null;

          return {
            tipo:
              entry.type === "add"
                ? "adicion"
                : entry.type === "decrease"
                ? "toma_parcial"
                : "cierre_total",
            porcentaje: parseFloat(alloc.activeAllocation || "0") / 100,
            precio: parseFloat(entry.price || "0"),
          };
        })
        .filter(Boolean);

      return {
        tipoPosicion: pos.TradeDirection === "Buy" ? "largo" : "corto",
        precioEntrada,
        symbol: pos.Symbol,
        fechaCierre: pos.ClosingDate,
        transacciones,
      };
    });

    console.log("🚀 Enviando a procesador:", CALCULATOR_URL);
    console.log("📊 Payload:", JSON.stringify(processed, null, 2));

    const profitability = await axios.post(CALCULATOR_URL, processed, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("✅ Respuesta recibida del procesador.");
    const { rentabilidadTotalActiva } = profitability.data;

    return {
      source: endpointUrl,
      totalPositions: positions.length,
      rentabilidadTotal: {
        rentabilidadTotalActiva,
      },
    };
  } catch (error) {
    console.error("❌ Error durante el cálculo:", error.message);
    if (error.response) {
      console.error("🧾 Detalle del error:", error.response.data);
      return { error: error.response.data };
    }
    return { error: error.message };
  }
}
