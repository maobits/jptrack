// src/utils/calculatePositionProfitability.js
import fetch from "node-fetch";

export const calculatePositionProfitability = async (position) => {
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

        return {
          tipo,
          porcentaje,
          precio: parseFloat(entry.price),
        };
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

    const response = await fetch(
      "http://localhost:3600/procesar-transacciones", // <-- ACTUALIZADO
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    const result = await response.json();
    const estado = result.estadoActual || {};

    return {
      symbol,
      precioPromedio: parseFloat(estado.precioPromedio) || null,
      rentabilidadTotalActiva:
        parseFloat(estado.rentabilidadTotalActiva) || null,
      porcentajeAsignacionActiva:
        parseFloat(estado.porcentajeAsignacionActiva) || null,
    };
  } catch (err) {
    console.error(
      `❌ Error al calcular rentabilidad para ${position.Symbol}`,
      err
    );
    return {
      symbol: position.Symbol,
      precioPromedio: null,
      rentabilidadTotalActiva: null,
      porcentajeAsignacionActiva: null,
      error: err.message,
    };
  }
};
