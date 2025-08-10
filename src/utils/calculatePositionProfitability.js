import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // para cargar las variables del .env

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
        const allocation = allocations.find(
          (alloc) => parseInt(alloc.id) === parseInt(entry.id)
        );

        if (!allocation) {
          console.warn(
            `⚠️ Sin asignación encontrada para entry.id=${entry.id} en ${position.Symbol}`
          );
          return null;
        }

        const porcentaje = parseFloat(allocation.activeAllocation || "0") / 100;

        if (isNaN(porcentaje) || porcentaje <= 0) {
          console.warn(
            `⚠️ Porcentaje inválido (${porcentaje}) para ${position.Symbol}`
          );
          return null;
        }

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

    // Usar URL de entorno o localhost como fallback
    const url =
      process.env.CALCULATOR_URL ||
      "http://localhost:3600/procesar-transacciones";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    const result = await response.json();
    const estado = result.estadoActual || {};
    const historial = result.historial || [];

    const ultimaCierre = historial
      .filter((h) => h.tipo === "cierre_total")
      .pop();

    return {
      symbol,
      precioPromedio: parseFloat(estado.precioPromedio) || null,
      rentabilidadTotalActiva: parseFloat(estado.rentabilidadTotal) || null,
      porcentajeAsignacionActiva:
        parseFloat(estado.porcentajeAsignacionActiva) || null,
      rentabilidadTotalCerrada: ultimaCierre
        ? parseFloat(ultimaCierre.rentabilidadTotal)
        : null,
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
      rentabilidadTotalCerrada: null,
      error: err.message,
    };
  }
};
