import { useGameStore } from '@/stores/gameStore';
import { useShallow } from 'zustand/shallow';

export const ScoresList = () => {
  const scores = useGameStore(useShallow((state) => state.scores));

  return (
    <div className='w-max max-h-full border-r-2 pr-3'>
      <ul className='list'>
        {scores &&
          Object.entries(scores).map(([login, score]) => (
            <li key={login}>
              <strong>{login}</strong> - {score}
            </li>
          ))}
      </ul>
    </div>
  );
};
