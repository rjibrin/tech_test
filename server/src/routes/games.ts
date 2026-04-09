import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { z } from "zod";
import { gameSchema } from "../schemas/games.js";

const router = Router();

// Save a game result
router.post("/", async (req, res) => {
  const parse = gameSchema.safeParse(req.body)
  if (!parse.success) {
    return res.status(400).json({ error: z.treeifyError(parse.error) });
  }

  const { boardSize, playerXId, playerOId, result } = parse.data;

  let playerXResult: "won" | "lost" | "draw"
  let playerOResult: "won" | "lost" | "draw"
  switch (result) {
    case "x_won":
      playerXResult = "won"
      playerOResult = "lost"
      break
    case "o_won":
      playerXResult = "lost"
      playerOResult = "won"
      break
    case "draw":
      playerXResult = "draw"
      playerOResult = "draw"
  }

  try {
    const game = await prisma.game.create({
      data: {
        boardSize,
        players: {
          create: [
            { playerId: playerXId, symbol: "X", result: playerXResult },
            { playerId: playerOId, symbol: "O", result: playerOResult },
          ],
        },
      },
      include: { players: true },
    });

    res.status(201).json(game);
  } catch (e: any) {
    if (e?.code === "P2003") {
      return res.status(400).json({ error: "Invalid player ID" });
    }
    throw e;
  }
});

export default router;
