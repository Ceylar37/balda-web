import { useGameStore } from '@/stores/gameStore';
import { useShallow } from 'zustand/shallow';

export const CurrentPlayer = () => {
  const currentPlayer = useGameStore(useShallow((state) => state.currentPlayer?.login));
  const winner = useGameStore(useShallow((state) => state.winner));

  return (
    <div className='flex items-center justify-between'>
      <h3 className='h3 capitalize'>{winner ? `победил ${winner}` : `ходит игрок ${currentPlayer}`}</h3>
    </div>
  );
};
