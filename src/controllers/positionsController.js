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
 * Controlador para cargar, enriquecer y retornar las posiciones (abiertas o cerradas)
 * con su rentabilidad, precio promedio y asignación activa, usando un servicio externo.
 *
 * Versión actual: 1.0
 * Fecha última revisión: 2025-08-02
 * -----------------------------------------------------------------------------
 */

import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import fetch from "node-fetch";

// Config
const BASE_URL = process.env.BITACORA_API_URL;
const API_KEY = process.env.BITACORA_API_KEY;
const CALCULATOR_URL =
  process.env.CALCULATOR_URL || "http://localhost:3600/procesar-transacciones";

console.log("🔍 Cargando variables de entorno...");
console.log("📦 BITACORA_API_URL:", BASE_URL);
console.log("🔑 BITACORA_API_KEY:", API_KEY);
console.log("🧮 CALCULATOR_URL:", CALCULATOR_URL);

if (!BASE_URL || !API_KEY) {
  console.error(
    "❌ ERROR: BITACORA_API_URL o BITACORA_API_KEY no están definidos"
  );
  process.exit(1);
}

// 👉 Helper para enriquecer una posición con valores calculados
const calculatePositionProfitability = async (position) => {
  try {
    const priceEntries = JSON.parse(position.PriceEntry);
    const allocations = JSON.parse(position.ActiveAllocation);

    const tipoPosicion = position.TradeDirection === "Buy" ? "largo" : "corto";
    const precioEntrada = parseFloat(
      priceEntries.find((entry) => entry.id === 1)?.price || "0"
    );
    const symbol = position.Symbol;
    const closingDate = position.ClosingDate;

    const transacciones = priceEntries
      .slice(1)
      .map((entry) => {
        const allocation = allocations.find((alloc) => alloc.id === entry.id);
        if (!allocation) return null;
        const porcentaje = parseFloat(allocation.activeAllocation) / 100;
        const tipo =
          entry.type === "add"
            ? "adicion"
            : entry.type === "decrease"
            ? "toma_parcial"
            : "cierre_total";
        return { tipo, porcentaje, precio: parseFloat(entry.price) };
      })
      .filter(Boolean);

    const requestData = {
      tipoPosicion,
      precioEntrada,
      symbol,
      transacciones,
      closingDate,
    };

    console.log("📤 Enviando a calculadora:", requestData);

    const response = await fetch(CALCULATOR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);

    const result = await response.json();
    const estado = result.estadoActual || {};

    return {
      precioPromedio: parseFloat(estado.precioPromedio) || null,
      rentabilidadTotalActiva:
        parseFloat(estado.rentabilidadTotalActiva) || null,
      porcentajeAsignacionActiva:
        parseFloat(estado.porcentajeAsignacionActiva) || null,
    };
  } catch (err) {
    console.error(`❌ Error al calcular para ${position.Symbol}:`, err.message);
    return {
      precioPromedio: null,
      rentabilidadTotalActiva: null,
      porcentajeAsignacionActiva: null,
    };
  }
};

// 🔁 Obtener posiciones abiertas
export const getOpenPositions = async (req, res) => {
  try {
    const targetUrl = `${BASE_URL}/api/positions`;
    console.log("📡 Llamando a:", targetUrl);

    const response = await axios.get(targetUrl, {
      headers: { "x-api-key": API_KEY },
    });

    const positions = response.data?.results || [];

    const enriched = await Promise.all(
      positions.map(async (p) => ({
        ...p,
        ...(await calculatePositionProfitability(p)),
      }))
    );

    console.log("✅ Posiciones abiertas enriquecidas");
    res.json({ count: enriched.length, results: enriched });
  } catch (err) {
    console.error("❌ Error en getOpenPositions:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// 🔁 Obtener todas las posiciones cerradas
export const getClosedPositions = async (req, res) => {
  try {
    const targetUrl = `${BASE_URL}/api/positions/closed-positions`;
    console.log("📡 Llamando a:", targetUrl);

    const response = await axios.get(targetUrl, {
      headers: { "x-api-key": API_KEY },
    });

    const positions = response.data?.results || [];

    const enriched = await Promise.all(
      positions.map(async (p) => ({
        ...p,
        ...(await calculatePositionProfitability(p)),
      }))
    );

    console.log("✅ Posiciones cerradas enriquecidas");
    res.json({ count: enriched.length, results: enriched });
  } catch (err) {
    console.error("❌ Error en getClosedPositions:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// 🔁 Obtener posiciones cerradas con filtro de meses
export const getClosedPositionsWithFilter = async (req, res) => {
  const { months = 13 } = req.query;
  try {
    const targetUrl = `${BASE_URL}/api/positions/closed-positions-with-filter`;
    console.log(`📡 Llamando a: ${targetUrl} con filtro de ${months} mes(es)`);

    const response = await axios.get(targetUrl, {
      headers: { "x-api-key": API_KEY },
      params: { months },
    });

    const positions = response.data?.results || [];

    const enriched = await Promise.all(
      positions.map(async (p) => ({
        ...p,
        ...(await calculatePositionProfitability(p)),
      }))
    );

    console.log("✅ Posiciones filtradas enriquecidas");
    res.json({ count: enriched.length, results: enriched });
  } catch (err) {
    console.error("❌ Error en getClosedPositionsWithFilter:", err.message);
    res.status(500).json({ error: err.message });
  }
};
