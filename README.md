# Spruce Tech Test

This repository contains my solution to the Spruce tech test as described in `BRIEF.md`.

## To Run
### Server
- `cd server`
- `npm install`
- add `.env` file with `DATABASE_URL="file:./dev.db"` to `server` directory
- `npx prisma generate` only necessary after new install or if schema changes
- `npm run dev` runs Prisma migration, seeds the database, and starts Express server
- runs on localhost:3000

### Client
- `cd client`
- `npm install`
- `npm start`
- runs on localhost:3001

### Optional
- `npx prisma studio` from the `server` directory to view the database
- `npm test` from `client` directory to run tests on game logic for all board sizes

## Overview
### Server

- Used Express for the server with TypeScript
- Used Zod for request validation
- Used SQLite with Prisma for database
- Database schema has 3 tables (found in `server/prisma/schema.prisma`): 
  - Table `Player` contains `userName` which is used as unique public identifier.
  - Table `Game` contains non-player specific information on past games. Games which ended prematurely are not stored.
  - Table `GamePlayer` is a join table that links `Game` to `Player` in a many-to-many relationship. Each row represents one player's participation in one game, storing their symbol (X/O) and result (won/lost/draw). This table is queried to compute leaderboard statistics.
- Leaderboard is computed in two ways:
  - `/api/players/leaderboard` aggregates data in the server using TypeScript. The client calls this endpoint.
  - `/api/players/leaderboard/queryraw` uses SQL to efficiently aggregate data in the database. Leads to substantial speedup on large databases such as `prisma/largeSeed.ts`.

### Client

- Expanded on provided `XorO` type for assigning player symbols and recording moves
- Replaced `<div>` board cells with `<button>` elements to improve accessibility
- Added disable logic to prevent unwanted moves or changes, e.g., no moves after game ends, cannot select taken cell, cannot change settings during game
- `client/src/lib/gameLogic.ts` implements win/draw detection by checking rows, columns, and diagonals without external libraries
- Added Jest tests for game logic in `client/src/__tests__/checkBoard.test.ts`
- Select elements for players and board size
- Leaderboard rendered in a separate "page" from game board

## Potential Upgrades

Here are some directions I considered but did not implement to keep the scope focused:

- **UI library**: Use a UI library for more polished design and advanced components such as dialogs
- **Leaderboard features**: Add sorting by different metrics, pagination, and search
- **Form validation**: Use a declarative form library on the client side
- **Client-side routing**: Facilitate design of complex navigation between pages
- **API type safety**: Implement end-to-end type safety between client and server