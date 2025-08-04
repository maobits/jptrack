/**
 * -----------------------------------------------------------------------------
 * Personalizado por: Maobits NIT 1061740164
 * Desde: 2025-08-03
 *
 * Desarrollador responsable: Mauricio Chara (https://www.instagram.com/maobits.io)
 * Contacto: code@maobits.com
 *
 * Descripción del archivo:
 * Calcula la rentabilidad compuesta mensual de las posiciones cerradas del portafolio,
 * utilizando el microservicio de procesamiento alojado en CALCULATOR_URL.
 *
 * Versión actual: 1.1
 * Fecha última revisión: 2025-08-03
 * -----------------------------------------------------------------------------
 */

import dotenv from "dotenv";
dotenv.config();

import { calculatePositionProfitability } from "./calculatePositionProfitability.js";

/**
 * Calcula la rentabilidad total compuesta mensual del portafolio cerrado.
 * @param {Array} portfolio - Array de posiciones cerradas.
 * @returns {Object} Resultados agrupados por mes y rentabilidad total compuesta.
 */
const ObtenerRentabilidadTotalCerradas = async (portfolio) => {
  const agrupadoPorMes = {};
  console.log("📦 Iniciando cálculo de rentabilidad del portafolio cerrado...");
  console.log(`🔢 Total de posiciones: ${portfolio.length}`);

  for (const position of portfolio) {
    console.log(`\n➡️ Procesando posición: ${position.Symbol}`);
    try {
      const result = await calculatePositionProfitability(position);
      const fecha = position.ClosingDate?.slice(0, 10);
      const mes = fecha?.slice(0, 7);
      const rentabilidad = result.rentabilidadTotalActiva;

      console.log("🔍 Resultado recibido:", result);

      if (fecha && mes && !isNaN(rentabilidad)) {
        console.log(`📅 Fecha: ${fecha}, Grupo: ${mes}`);
        console.log(`📈 Rentabilidad: ${rentabilidad}%`);

        if (!agrupadoPorMes[mes]) {
          agrupadoPorMes[mes] = [];
        }
        agrupadoPorMes[mes].push(rentabilidad);
      } else {
        console.warn(
          `⚠️ Rentabilidad inválida o sin fecha para: ${position.Symbol}`
        );
      }
    } catch (error) {
      console.error(`❌ Error al procesar ${position.Symbol}:`, error.message);
    }
  }

  console.log(
    "\n🧾 RTC - Colección agrupada por meses:",
    JSON.stringify(agrupadoPorMes, null, 2)
  );

  const detallePorMes = {};
  let rentabilidadCompuestaDecimal = 1;

  console.log("\n📊 Calculando promedios mensuales...");

  for (const mes in agrupadoPorMes) {
    // 🛡️ Filtramos valores inválidos (null, undefined, NaN)
    const valoresValidos = agrupadoPorMes[mes].filter(
      (v) => v !== null && v !== undefined && !isNaN(v)
    );

    const promedio =
      valoresValidos.reduce((a, b) => a + b, 0) / valoresValidos.length;
    const promedioDecimal = parseFloat((promedio / 100).toFixed(5));

    detallePorMes[mes] = {
      promedioMensual: parseFloat(promedio.toFixed(4)),
      numeroRegistros: valoresValidos.length,
      rentabilidades: valoresValidos,
    };

    console.log(`🗓️ Mes: ${mes}`);
    console.log(`   ➕ Rentabilidades válidas: ${valoresValidos.join(", ")}`);
    console.log(`   📊 Promedio: ${promedio.toFixed(4)}%`);
    console.log(`   🔢 Multiplicando: *= 1 + ${promedioDecimal}`);

    rentabilidadCompuestaDecimal *= 1 + promedioDecimal;
  }

  const rentabilidadTotalCompuestaDecimal = rentabilidadCompuestaDecimal - 1;
  const rentabilidadTotalCompuesta = rentabilidadTotalCompuestaDecimal * 100;

  console.log(
    `\n📈 Rentabilidad compuesta decimal: ${rentabilidadTotalCompuestaDecimal.toFixed(
      6
    )}`
  );
  console.log(
    `📈 Rentabilidad compuesta final: ${rentabilidadTotalCompuesta.toFixed(2)}%`
  );

  return {
    detallePorMes,
    rentabilidadTotalCompuesta: parseFloat(
      rentabilidadTotalCompuesta.toFixed(2)
    ),
    rentabilidadTotalCompuestaDecimal: parseFloat(
      rentabilidadTotalCompuestaDecimal.toFixed(6)
    ),
  };
};

export default ObtenerRentabilidadTotalCerradas;
