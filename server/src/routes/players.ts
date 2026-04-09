import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { PlayerResult } from "../../generated/prisma/client";

const router = Router();

// List all players
router.get("/", async (_req, res) => {
  const players = await prisma.player.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(players);
});

// Get leaderboard
router.get("/leaderboard", async (_req, res) => {
  const players = await prisma.player.findMany({
    include: { games: true },
  });

  const stats = players.map((player) => ({
    id: player.id,
    userName: player.userName,
    wins: player.games.filter((g) => g.result === PlayerResult.won).length,
    losses: player.games.filter((g) => g.result === PlayerResult.lost).length,
    draws: player.games.filter((g) => g.result === PlayerResult.draw).length,
  }));

  stats.sort((a, b) => b.wins - a.wins);
  res.json(stats);
});

export default router;