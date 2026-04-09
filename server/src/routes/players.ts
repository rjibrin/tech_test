import { Router } from "express";
import { prisma } from "../lib/prisma.js";

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
    wins: player.games.filter((g) => g.result === "won").length,
    losses: player.games.filter((g) => g.result === "lost").length,
    draws: player.games.filter((g) => g.result === "draw").length,
  }));

  stats.sort((a, b) => b.wins - a.wins);
  res.json(stats);
});

export default router;