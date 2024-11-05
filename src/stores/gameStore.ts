import { Board, getBoard, turn } from '@/api';
import { Cell, CellType } from '@/shared/types/Cell';
import { Cords } from '@/shared/types/Cords';
import { formatMatrix } from '@/shared/utils';
import { create } from 'zustand';
import { useAuthStore } from './authStore';

type State = {
  isLoading: boolean;
  selectedPath: string[];
  word: string | null;
  winner: string | null;
} & Omit<Board, 'board'> & {
    board?: {
      matrixValue?: Cell[][];
      size?: number;
    };
  };

const initState: State = {
  id: undefined,
  isLoading: true,
  selectedPath: [],
  word: null,
  winner: null
};

type Action = {
  loadGame: (id: string) => Promise<void>;
  handleSelectCell: ({ i, j }: Cords) => void;
  handleEndSelection: () => void;
  clearGame: () => void;
  isMyTurn: () => boolean;
  getPossibleCellInPathCords: () => Cords | null;
  applyWord: (letter: string) => Promise<void>;
  clearWord: () => void;
};

let timeout: ReturnType<typeof setTimeout> | null = null;

export const useGameStore = create<State & Action>((set, get) => ({
  ...initState,
  loadGame: async (id: string) => {
    const { isMyTurn, loadGame } = get();

    const response = await getBoard({ boardId: id });
    if (!response.payload) {
      return;
    }

    if (
      response.payload.scores &&
      response.payload.board?.matrixValue &&
      response.payload.board.matrixValue.join('').indexOf('@') === -1
    ) {
      set({
        winner: Object.entries(response.payload.scores).reduce(
          (max, [key, value]) => (value > max.value ? { key, value } : max),
          { key: '', value: 0 }
        ).key
      });
    }

    const matrixValue = response.payload.board?.matrixValue?.map((row) => row.split(''));

    if (!matrixValue) {
      return undefined;
    }

    set({
      isLoading: false,
      ...response.payload,
      board: {
        ...response.payload.board,
        matrixValue: formatMatrix(matrixValue)
      }
    });

    if (!isMyTurn() && !timeout) {
      timeout = setTimeout(() => loadGame(id), 5000);
    }
  },
  handleSelectCell: ({ i, j }) => {
    const { board, selectedPath, getPossibleCellInPathCords: possibleInPath } = get();
    if (!board?.size) {
      return;
    }

    if (i < 0 || j < 0 || i >= board?.size || j >= board?.size) {
      return;
    }

    const { matrixValue } = board;
    if (!matrixValue) {
      return;
    }

    const key = `${i}-${j}`;
    // Если клетка в пути
    const indexOfCellFromPath = selectedPath.findIndex((path) => path === key);
    if (indexOfCellFromPath !== -1) {
      set({
        selectedPath: selectedPath.slice(0, indexOfCellFromPath + 1)
      });
      return;
    }

    const currentCell = matrixValue[i][j];
    // Если клетка пустая
    if (currentCell.type === CellType.Empty) {
      return;
    }

    // Является ли клетка соседней с предыдущей
    if (selectedPath.length !== 0) {
      const [lastI, lastJ] = selectedPath[selectedPath.length - 1].split('-').map(Number);

      if (Math.abs(lastI - i) > 1 || Math.abs(lastJ - j) > 1) {
        return;
      }

      if (Math.abs(lastI - i) === 1 && Math.abs(lastJ - j) === 1) {
        return;
      }
    }

    // Если клетка без буквы соседствует с буквой, проверяем наличие аналогичной клетки в пути
    if (currentCell.type === CellType.Possible) {
      if (possibleInPath()) {
        return;
      }
      set({
        selectedPath: [...selectedPath, key]
      });
      return;
    }

    set({
      selectedPath: [...selectedPath, key]
    });
  },
  clearGame: () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    set(initState);
  },
  isMyTurn: () => get().currentPlayer?.login === useAuthStore.getState().login,
  getPossibleCellInPathCords: () => {
    const { board, selectedPath } = get();

    if (!board) {
      return null;
    }

    const { matrixValue } = board;
    if (!matrixValue) {
      return null;
    }

    const key = selectedPath.find((path) => {
      const [i, j] = path.split('-').map(Number);
      return matrixValue[i][j].type === CellType.Possible;
    });

    if (!key) {
      return null;
    }

    const [i, j] = key.split('-').map(Number);
    return {
      i,
      j
    };
  },
  handleEndSelection: () => {
    const { selectedPath, getPossibleCellInPathCords, board } = get();

    if (!board) {
      return;
    }

    const { matrixValue } = board;

    if (!matrixValue) {
      return;
    }

    if (selectedPath.length === 0) {
      return;
    }

    const cords = getPossibleCellInPathCords();
    if (!cords) {
      set({ selectedPath: [] });
      return;
    }

    set({
      word: selectedPath
        .map((path) => {
          const [i, j] = path.split('-').map(Number);
          return matrixValue[i][j].value ?? '*';
        })
        .join('')
    });
  },
  clearWord: () => set({ word: null, selectedPath: [] }),
  applyWord: async (letter: string) => {
    const { id, getPossibleCellInPathCords, selectedPath, word, isMyTurn, loadGame } = get();

    if (!id) {
      return;
    }

    const cords = getPossibleCellInPathCords();

    if (!cords) {
      return;
    }

    const response = await turn({
      boardId: id,
      turn: {
        newCharacter: letter,
        newCharacterPosition: {
          x: cords.j,
          y: cords.i
        },
        positionChain: selectedPath.map((path) => {
          const [i, j] = path.split('-').map(Number);
          return {
            x: j,
            y: i
          };
        }),
        word: word?.replace('*', letter)
      }
    });

    if (!response.payload) {
      return;
    }

    if (response.responseCode !== 'SUCCESS') {
      return;
    }

    const matrixValue = response.payload?.board?.matrixValue?.map((row) => row.split(''));

    if (!matrixValue) {
      return;
    }

    if (
      response.payload.scores &&
      response.payload.board?.matrixValue &&
      response.payload.board.matrixValue.join('').indexOf('@') === -1
    ) {
      set({
        winner: Object.entries(response.payload.scores).reduce(
          (max, [key, value]) => (value > max.value ? { key, value } : max),
          { key: '', value: 0 }
        ).key
      });
    }

    set({
      selectedPath: [],
      word: null,
      ...response.payload,
      board: {
        ...response.payload.board,
        matrixValue: formatMatrix(matrixValue)
      }
    });

    if (!isMyTurn() && !timeout) {
      timeout = setTimeout(() => loadGame(id), 5000);
    }
  }
}));
