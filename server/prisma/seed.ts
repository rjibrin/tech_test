import { prisma } from "../src/lib/prisma";

async function seed() {
  // Create players
  const alice = await prisma.player.create({ data: { userName: "alice15" } });
  const bob = await prisma.player.create({ data: { userName: "bob.cruz" } });
  const charlie = await prisma.player.create({ data: { userName: "charlie.brown" } });
  const emptyPlayer = await prisma.player.create({ data: { userName: "oto1" } });

  // Game 1: Alice (X) vs Bob (O) — Alice wins on 3x3
  const game1 = await prisma.game.create({ data: { boardSize: 3 } });
  await prisma.gamePlayer.createMany({
    data: [
      { gameId: game1.id, playerId: alice.id, symbol: "X", result: "won" },
      { gameId: game1.id, playerId: bob.id, symbol: "O", result: "lost" },
    ],
  });

  // Game 2: Bob (X) vs Charlie (O) — Draw on 3x3
  const game2 = await prisma.game.create({ data: { boardSize: 3 } });
  await prisma.gamePlayer.createMany({
    data: [
      { gameId: game2.id, playerId: bob.id, symbol: "X", result: "draw" },
      { gameId: game2.id, playerId: charlie.id, symbol: "O", result: "draw" },
    ],
  });

  // Game 3: Charlie (X) vs Alice (O) — Charlie wins on 5x5
  const game3 = await prisma.game.create({ data: { boardSize: 5 } });
  await prisma.gamePlayer.createMany({
    data: [
      { gameId: game3.id, playerId: charlie.id, symbol: "X", result: "won" },
      { gameId: game3.id, playerId: alice.id, symbol: "O", result: "lost" },
    ],
  });

  // Game 4: Alice (X) vs Charlie (O) — Alice wins on 4x4
  const game4 = await prisma.game.create({ data: { boardSize: 4 } });
  await prisma.gamePlayer.createMany({
    data: [
      { gameId: game4.id, playerId: alice.id, symbol: "X", result: "won" },
      { gameId: game4.id, playerId: charlie.id, symbol: "O", result: "lost" },
    ],
  });

  // Game 5: Bob (X) vs Alice (O) — Bob wins on 3x3
  const game5 = await prisma.game.create({ data: { boardSize: 3 } });
  await prisma.gamePlayer.createMany({
    data: [
      { gameId: game5.id, playerId: bob.id, symbol: "X", result: "won" },
      { gameId: game5.id, playerId: alice.id, symbol: "O", result: "lost" },
    ],
  });

   // Game 6: Alice (X) vs Charlie (O) — Draw on 3x3
  const game6 = await prisma.game.create({ data: { boardSize: 3 } });
  await prisma.gamePlayer.createMany({
    data: [
      { gameId: game6.id, playerId: alice.id, symbol: "X", result: "draw" },
      { gameId: game6.id, playerId: charlie.id, symbol: "O", result: "draw" },
    ],
  });

  console.log("Seeded: 3 players, 5 games");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
