import { prisma } from "../src/lib/prisma";

async function seed() {
  const PLAYER_COUNT = 10000;
  const GAME_COUNT = 40000;
  const boardSizes = [3, 4, 5, 6, 7];
  const results: ["won", "lost", "draw"] = ["won", "lost", "draw"];

  // Create 1000 players in bulk
  await prisma.player.createMany({
    data: Array.from({ length: PLAYER_COUNT }, (_, i) => ({
      userName: `player_${i + 1}`,
    })),
  });

  const players = await prisma.player.findMany({ select: { id: true } });
  const playerIds = players.map((p) => p.id);

  // Create 4000 games with corresponding GamePlayer entries
  for (let i = 0; i < GAME_COUNT; i++) {
    // pick two distinct random players
    const xIndex = Math.floor(Math.random() * playerIds.length);
    let oIndex = Math.floor(Math.random() * (playerIds.length - 1));
    if (oIndex >= xIndex) oIndex++;

    const boardSize = boardSizes[Math.floor(Math.random() * boardSizes.length)];
    const outcome = results[Math.floor(Math.random() * results.length)];

    let xResult: "won" | "lost" | "draw";
    let oResult: "won" | "lost" | "draw";
    if (outcome === "won") {
      xResult = "won";
      oResult = "lost";
    } else if (outcome === "lost") {
      xResult = "lost";
      oResult = "won";
    } else {
      xResult = "draw";
      oResult = "draw";
    }

    const game = await prisma.game.create({ data: { boardSize } });
    await prisma.gamePlayer.createMany({
      data: [
        { gameId: game.id, playerId: playerIds[xIndex], symbol: "X", result: xResult },
        { gameId: game.id, playerId: playerIds[oIndex], symbol: "O", result: oResult },
      ],
    });
  }

  console.log(`Seeded: ${PLAYER_COUNT} players, ${GAME_COUNT} games`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
