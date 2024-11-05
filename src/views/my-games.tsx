import { usePlayerGamesStore } from '@/stores/playerGames';
import { Button } from '@/ui/button';
import { Loader } from '@/ui/loader';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const MyGames = () => {
  const { fetchGames, games, isLoading } = usePlayerGamesStore();

  useEffect(() => {
    fetchGames();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (games === null || games.length === 0) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <p className='p text-center'>
          Похоже у вас нет активных игр
          <br /> Но вы можете{' '}
          <Link to={'/create-game'} className='p-0'>
            <Button variant='link' className='p-0 text-base'>
              создать новую
            </Button>
          </Link>
        </p>
      </div>
    );
  }

  return (
    <ul className='flex-1 list'>
      {games.map((game) => (
        <li key={game.id}>
          <Link to={`/${game.id}`}>
            <Button variant='link'>{game.id}</Button>
          </Link>
        </li>
      ))}
    </ul>
  );
};
