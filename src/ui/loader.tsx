import { LoaderCircle } from 'lucide-react';

export const Loader = () => {
  return (
    <div className='flex-1 flex items-center justify-center'>
      <LoaderCircle className='animate-spin h-10 w-10' />
    </div>
  );
};
