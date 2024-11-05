import { useAuthStore } from '@/stores/authStore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu';
import { Menu as LucideMenu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Menu = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <LucideMenu />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => navigate('/')}>Мои игры</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/create-game')}>Создать игру</DropdownMenuItem>
        <hr />
        <DropdownMenuItem onClick={logout}>Выход</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
