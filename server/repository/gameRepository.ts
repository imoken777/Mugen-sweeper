import type { GameModel } from '$/commonTypesWithClient/models';
import { gameIdParser } from '$/service/idParsers';
import { prismaClient } from '$/service/prismaClient';
import type { Game } from '@prisma/client';
import { z } from 'zod';

const toGameModel = (prismaGame: Game) => ({
  id: gameIdParser.parse(prismaGame.id),
  bombMap: z.array(z.array(z.union([z.literal(0), z.literal(1)]))).parse(prismaGame.bombMap),
  userInputs: z
    .array(z.array(z.union([z.literal(0), z.literal(1), z.literal(2)])))
    .parse(prismaGame.userInputs),
});

export const gameRepository = {
  save: async (game: GameModel): Promise<GameModel | null> => {
    try {
      const prismaGame = await prismaClient.game.upsert({
        where: { id: game.id },
        update: { userInputs: game.userInputs },
        create: { id: game.id, bombMap: game.bombMap, userInputs: game.userInputs },
      });
      return toGameModel(prismaGame);
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  find: async (): Promise<GameModel | null> => {
    try {
      const prismaGame = await prismaClient.game.findFirst();
      return prismaGame !== null ? toGameModel(prismaGame) : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};
