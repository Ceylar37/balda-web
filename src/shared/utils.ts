import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Cell, CellType } from './types/Cell';
import { Cords } from './types/Cords';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkNeighbors<T>({
  matrix,
  i,
  j,
  cb
}: {
  matrix: T[][];
  cb: (value: T) => boolean;
} & Cords) {
  if (i - 1 >= 0 && cb(matrix[i - 1][j])) {
    return true;
  }

  if (j - 1 >= 0 && cb(matrix[i][j - 1])) {
    return true;
  }
  if (i + 1 < matrix.length && cb(matrix[i + 1][j])) {
    return true;
  }

  if (j + 1 < matrix[i].length && cb(matrix[i][j + 1])) {
    return true;
  }

  return false;
}

export function formatMatrix(matrixValue: string[][]) {
  const matrixValueWithMarkedPossibleCells: Cell[][] = [];

  for (let i = 0; i < matrixValue.length; i++) {
    matrixValueWithMarkedPossibleCells.push([] as Cell[]);
    for (let j = 0; j < matrixValue[i].length; j++) {
      if (matrixValue[i][j] === '@') {
        matrixValueWithMarkedPossibleCells[i].push({
          type: checkNeighbors<string>({ matrix: matrixValue, i, j, cb: (value) => value !== '@' })
            ? CellType.Possible
            : CellType.Empty
        });
        continue;
      }

      matrixValueWithMarkedPossibleCells[i].push({
        value: matrixValue[i][j],
        type: CellType.Letter
      });
    }
  }

  return matrixValueWithMarkedPossibleCells;
}

