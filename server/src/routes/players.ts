import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { PlayerResult } from "../../generated/prisma/client";

const router = Router();

// List all players
router.get("/", async (_req, res) => {
  const players = await prisma.player.findMany({
    orderBy: { userName: "asc" },
  });
  res.json(players);
});

// Get leaderboard by aggregating data in server using TypeScript
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

// Get leaderboard using database aggregation for efficiency
router.get("/leaderboard/queryraw", async (_req, res) => {
  const stats = await prisma.$queryRaw`
    SELECT p.id, p."userName",
      COUNT(CASE WHEN gp.result = 'won' THEN 1 END) AS wins,
      COUNT(CASE WHEN gp.result = 'lost' THEN 1 END) AS losses,
      COUNT(CASE WHEN gp.result = 'draw' THEN 1 END) AS draws
    FROM Player p
    LEFT JOIN GamePlayer gp ON gp."playerId" = p.id
    GROUP BY p.id
    ORDER BY wins DESC
  `;
  res.json(JSON.parse(JSON.stringify(stats, (_, v) => typeof v === "bigint" ? Number(v) : v)));
});

export default router;