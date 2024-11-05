import { Board } from '@/components/board';
import { CurrentPlayer } from '@/components/current-player';
import { ScoresList } from '@/components/scores-list';
import { WordsList } from '@/components/words-list';
import { useGameStore } from '@/stores/gameStore';
import { Loader } from '@/ui/loader';
import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

export const Game = () => {
  const { id } = useParams();

  const loadGame = useGameStore(useShallow((state) => state.loadGame));
  const clearGame = useGameStore(useShallow((state) => state.clearGame));
  const isLoading = useGameStore(useShallow((state) => state.isLoading));

  useEffect(() => {
    if (!id) {
      return;
    }

    loadGame(id);

    return clearGame;
  }, [clearGame, id, loadGame]);

  if (!id) {
    return <Navigate to={'/'} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='flex-1 flex flex-col'>
      <div className='min-h-0 flex-1 p-2 flex flex-col'>
        <CurrentPlayer />
        <div className='min-h-0 pt-2 flex-1 flex'>
          <ScoresList />
          <WordsList />
        </div>
      </div>
      <Board />
    </div>
  );
};
