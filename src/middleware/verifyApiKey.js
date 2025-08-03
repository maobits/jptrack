/**
 * -----------------------------------------------------------------------------
 * Middleware: Protección de rutas usando API Key específica
 * Personalizado por: Maobits NIT 1061740164
 * Desde: 2025-08-02
 *
 * Desarrollador responsable: Mauricio Chara (https://www.instagram.com/maobits.io)
 * Contacto: code@maobits.com | +57 3153774638
 * -----------------------------------------------------------------------------
 */

export function verifyApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.BITACORA_API_KEY) {
    return res.status(403).json({ error: "Acceso denegado: API Key inválida" });
  }

  next();
}
