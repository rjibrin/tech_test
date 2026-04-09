import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { PlayerResult, PlayerSymbol } from "../../generated/prisma/client";
import { z } from "zod";
import { gameSchema } from "../schemas/games.js";

const router = Router();

// Save a game result
router.post("/", async (req, res) => {
  // parsing and validating request body
  const parse = gameSchema.safeParse(req.body)

  if (!parse.success) {
    return res.status(400).json({ error: z.treeifyError(parse.error) });
  }

  const { boardSize, playerXId, playerOId, result } = parse.data;

  // check player IDs exist
  const [playerX, playerO] = await Promise.all([
    prisma.player.findUnique({ where: { id: playerXId } }),
    prisma.player.findUnique({ where: { id: playerOId } }),
  ]);

  const invalid: string[] = [];
  if (!playerX) invalid.push("playerXId");
  if (!playerO) invalid.push("playerOId");

  if (invalid.length > 0) {
    return res.status(400).json({ error: `Invalid player ID: ${invalid.join(", ")}` });
  }

  // determine results
  let playerXResult: PlayerResult
  let playerOResult: PlayerResult
  switch (result) {
    case "x_won":
      playerXResult = PlayerResult.won
      playerOResult = PlayerResult.lost
      break
    case "o_won":
      playerXResult = PlayerResult.lost
      playerOResult = PlayerResult.won
      break
    case "draw":
      playerXResult = PlayerResult.draw
      playerOResult = PlayerResult.draw
  }

  // create game and gamePlayer entries
  try {
    const game = await prisma.game.create({
      data: {
        boardSize,
        players: {
          create: [
            { playerId: playerXId, symbol: PlayerSymbol.X, result: playerXResult },
            { playerId: playerOId, symbol: PlayerSymbol.O, result: playerOResult },
          ],
        },
      },
      include: { players: true },
    });

    res.status(201).json(game);
  } catch (e) {
    console.error("Failed to create game:", e);
    res.status(500).json({ error: "Failed to add game to database" });
  }
});

export default router;
