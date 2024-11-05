import { cn } from '@/shared/utils';
import { memo, PropsWithChildren } from 'react';

const CellBackground = ({ children }: PropsWithChildren) => {
  return <div className='relative border text-5xl flex items-center justify-center'>{children}</div>;
};

interface ColorizedBackgroundProps {
  className?: string;
  visible: boolean;
}

const ColorizedBackground = ({ className, visible }: ColorizedBackgroundProps) => {
  return (
    <div
      className={cn(
        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 h-[80%] w-[80%] transition-transform scale-0 duration-300',
        className,
        visible && 'scale-100'
      )}
    />
  );
};

const withColor = (Component: typeof ColorizedBackground, color?: 'bg-green-300' | 'bg-gray-600') => {
  return (props: ColorizedBackgroundProps) => <Component {...props} className={cn(color, props.className)} />;
};

const GreenBackground = withColor(ColorizedBackground, 'bg-green-300');
const GrayBackground = withColor(ColorizedBackground, 'bg-gray-600');

export const Cell = memo(({ value, color }: { value?: string; color?: 'green' | 'gray' }) => {
  return (
    <CellBackground>
      {value && <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%]'>{value}</span>}
      <GrayBackground visible={color === 'gray' || color === 'green'} />
      <GreenBackground visible={color === 'green'} />
    </CellBackground>
  );
});
