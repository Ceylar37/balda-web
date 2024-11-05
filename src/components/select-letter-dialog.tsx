import { cn } from '@/shared/utils';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';

const russianAlphabet = [
  'а',
  'б',
  'в',
  'г',
  'д',
  'е',
  'ж',
  'з',
  'и',
  'й',
  'к',
  'л',
  'м',
  'н',
  'о',
  'п',
  'р',
  'с',
  'т',
  'у',
  'ф',
  'х',
  'ц',
  'ч',
  'ш',
  'щ',
  'ъ',
  'ы',
  'ь',
  'э',
  'ю',
  'я'
];

export const SelectLetterDialog = () => {
  const word = useGameStore(useShallow((state) => state.word));
  const applyWord = useGameStore(useShallow((state) => state.applyWord));
  const clearWord = useGameStore(useShallow((state) => state.clearWord));
  const [start, end] = word?.split('*') ?? [];

  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const onSubmit = () => {
    if (!selectedLetter) {
      return;
    }

    applyWord(selectedLetter);
    setSelectedLetter(null);
  };

  const onClose = () => {
    setSelectedLetter(null);
    clearWord();
  };

  return (
    <Dialog open={!!word}>
      <DialogContent onClose={onClose} className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Выберите букву</DialogTitle>
          {
            <span className='border rounded-md text-center text-2xl font-bold'>
              {start}
              <span className={cn(selectedLetter && 'italic text-green-500')}>{selectedLetter ?? '*'}</span>
              {end}
            </span>
          }
        </DialogHeader>
        <div className='w-full grid grid-cols-5'>
          {russianAlphabet.map((letter) => (
            <div
              onClick={() => setSelectedLetter(letter)}
              key={letter}
              className='relative aspect-square text-4xl flex items-center justify-center'
            >
              <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%]'>{letter}</span>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button disabled={!selectedLetter} onClick={onSubmit}>
            Подтвердить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
