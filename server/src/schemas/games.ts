import { z } from "zod";

export const gameSchema = z.object({
  boardSize: z.number().min(3).max(15),
  playerXId: z.number(),
  playerOId: z.number(),
  result: z.enum(['x_won', 'o_won', 'draw'])
}).refine(data => data.playerXId !== data.playerOId, {
  message: "Players must be different"
})

