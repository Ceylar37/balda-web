import { useGameStore } from '@/stores/gameStore';
import { useShallow } from 'zustand/shallow';

export const WordsList = () => {
  const words = useGameStore(useShallow((state) => state.usedWords));

  return (
    <div className='relative max-h-full flex-1'>
      <div className='absolute top-0 left-0 w-full h-full flex justify-center overflow-auto'>
        <ul className='w-max flex flex-col items-center'>
          {words?.reverse().map((word) => <li key={word}>{word}</li>)}
        </ul>
      </div>
    </div>
  );
};
