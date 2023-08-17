import type { GameId, TaskId, UserId } from './branded';

export type UserModel = {
  id: UserId;
  email: string;
  displayName: string | undefined;
  photoURL: string | undefined;
};

export type TaskModel = {
  id: TaskId;
  label: string;
  done: boolean;
  created: number;
};
export type GameModel = {
  id: GameId;
  bombMap: (1 | 0)[][];
  userInputs: (0 | 1 | 2)[][];
};

export type CellModel = {
  x: number;
  y: number;
  IsBombCell: boolean;
  cellValue: number;
  whoOpened: UserId[] | null;
  whenOpened: number;
};

export type PlayerModel = {
  id: UserId;
  name: string;
  x: number;
  y: number;
  score: number;
  isLive: boolean;
};
