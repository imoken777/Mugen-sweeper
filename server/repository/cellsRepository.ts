import type { UserId } from '$/commonTypesWithClient/branded';
import type { CellModel } from '$/commonTypesWithClient/models';
import { userIdParser } from '$/service/idParsers';
import { prismaClient } from '$/service/prismaClient';
import type { Cell } from '@prisma/client';
import { z } from 'zod';
const toCellModel = (prismaCell: Cell): CellModel => ({
  x: z.number().min(0).parse(prismaCell.x),
  y: z.number().min(0).parse(prismaCell.y),
  cellValue: z.number().min(0).parse(prismaCell.cellValue),
  whoOpened: userIdParser.parse(prismaCell.whoOpened),
  whenOpened: prismaCell.whenOpened.getTime(),
  isUserInput: z.boolean().parse(prismaCell.isUserInput),
});

export const cellsRepository = {
  create: async (cell: CellModel): Promise<CellModel> => {
    const newCell = { ...cell, whenOpened: new Date(cell.whenOpened) };
    const prismaCell = await prismaClient.cell.create({
      data: newCell,
    });
    return toCellModel(prismaCell);
  },
  findAll: async (): Promise<CellModel[]> => {
    try {
      const prismaCells = await prismaClient.cell.findMany({
        orderBy: { x: 'asc', y: 'asc' },
      });
      return prismaCells.map(toCellModel);
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  findAllOfPlayer: async (userId: UserId): Promise<CellModel[]> => {
    try {
      const prismaCells = await prismaClient.cell.findMany({ where: { whoOpened: userId } });
      return prismaCells.length > 0 ? prismaCells.map(toCellModel) : [];
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  find: async (x: number, y: number): Promise<CellModel | null> => {
    try {
      const prismaCell = await prismaClient.cell.findUnique({ where: { pos: { x, y } } });
      return prismaCell !== null ? toCellModel(prismaCell) : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  findOlder: async (): Promise<CellModel[]> => {
    try {
      const prismaCells = await prismaClient.cell.findMany({ orderBy: { whenOpened: 'desc' } });
      return prismaCells.length > 0 ? prismaCells.map(toCellModel) : [];
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  findAllUserInputted: async (): Promise<CellModel[]> => {
    try {
      const prismaCells = await prismaClient.cell.findMany({ where: { isUserInput: true } });
      return prismaCells.length > 0 ? prismaCells.map(toCellModel) : [];
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  delete: async (x: number, y: number): Promise<void> => {
    try {
      await prismaClient.cell.delete({ where: { pos: { x, y } } });
    } catch (error) {
      console.log(error);
    }
  },
};
