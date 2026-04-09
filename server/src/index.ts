import express from "express";
import cors from "cors";

import playersRouter from "./routes/players.js";
import gamesRouter from "./routes/games.js";

const app = express();
app.use(cors());
app.use(express.json());

// Mount routers
app.use("/api/players", playersRouter);
app.use("/api/games", gamesRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});