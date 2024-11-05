import { Menu } from '@/components/menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuthStore } from '@/stores/authStore';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  const { login } = useAuthStore();

  return (
    <div className='min-h-svh bg-background flex flex-col'>
      <header className='border-b-2 py-2 px-3 flex items-center justify-between'>
        <h1 className='h1 leading-none'>{login}</h1>
        <div className='flex items-center gap-4'>
          <ThemeToggle />
          <Menu />
        </div>
      </header>
      <main className='flex-1 flex'>
        <Outlet />
      </main>
    </div>
  );
};
