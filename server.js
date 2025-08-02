import dotenv from "dotenv";
dotenv.config(); // ✅ Cargar variables de entorno antes de cualquier uso

import app from "./src/app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 JPTracker API corriendo en http://localhost:${PORT}`);
});
