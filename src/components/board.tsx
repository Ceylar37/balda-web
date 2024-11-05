import { CellType } from '@/shared/types/Cell';
import { Cords } from '@/shared/types/Cords';
import { cn } from '@/shared/utils';
import { useGameStore } from '@/stores/gameStore';
import { TouchEvent, useCallback, useEffect, useRef } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { useShallow } from 'zustand/shallow';
import { Cell } from './cell';
import { SelectLetterDialog } from './select-letter-dialog';

export const Board = () => {
  const matrixValue = useGameStore(useShallow((state) => state.board?.matrixValue));
  const size = useGameStore(useShallow((state) => state.board?.size));
  const selectedPath = useGameStore(useShallow((state) => state.selectedPath));
  const winner = useGameStore(useShallow((state) => state.winner));

  const getIsMyTurn = useGameStore(useShallow((state) => state.isMyTurn));
  const handleSelectCell = useGameStore(useShallow((state) => state.handleSelectCell));
  const handleEndSelection = useGameStore(useShallow((state) => state.handleEndSelection));
  const getPossibleCellInPathCords = useGameStore(useShallow((state) => state.getPossibleCellInPathCords));
  const possibleInPath = getPossibleCellInPathCords();

  const boardRef = useRef<HTMLDivElement>(null);
  const rect = useRef({ left: 0, top: 0, cellSize: 1 });

  useEffect(() => {
    if (!boardRef.current) {
      return;
    }

    const { left, top, width } = boardRef.current.getBoundingClientRect();
    rect.current = { left, top, cellSize: width / (size ?? 1) };
  }, [size]);

  useEffect(() => {
    const handle = (e: Event) => {
      e.preventDefault();
    };

    const board = boardRef.current;

    board?.addEventListener('touchmove', handle, { passive: false });
    return () => {
      board?.removeEventListener('touchmove', handle);
    };
  }, []);

  const isMyTurn = getIsMyTurn();

  const onTouchMove =
    isMyTurn && !winner
      ? (e: TouchEvent<HTMLDivElement>) => {
          const touch = e.touches[0];
          const [x, y] = [touch.clientX - rect.current.left, touch.clientY - rect.current.top];

          const [j, i] = [Math.floor(x / rect.current.cellSize), Math.floor(y / rect.current.cellSize)];
          handleSelectCell({ i, j });
        }
      : undefined;

  const onTouchEnd = isMyTurn && !winner ? handleEndSelection : undefined;

  const getInPath = useCallback(
    ({ i, j }: Cords) => {
      return selectedPath.includes(`${i}-${j}`);
    },
    [selectedPath]
  );

  return (
    <>
      <div
        ref={boardRef}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={cn(
          'w-full aspect-square grid border',
          size === 3 && 'grid-cols-3',
          size === 5 && 'grid-cols-5',
          size === 7 && 'grid-cols-7'
        )}
      >
        {matrixValue?.map((row, rowIndex) => (
          <Fragment key={rowIndex}>
            {row.map((cell, cellIndex) => {
              const inPath = getInPath({
                i: rowIndex,
                j: cellIndex
              });

              return (
                <Cell
                  key={`${rowIndex}-${cellIndex}`}
                  value={cell.value}
                  color={inPath ? 'green' : cell.type === CellType.Possible && !possibleInPath ? 'gray' : undefined}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
      <SelectLetterDialog />
    </>
  );
};
