import { useAuthStore } from '@/stores/authStore';
import { Authorization } from '@/views/authorization';
import { FC, PropsWithChildren, useEffect } from 'react';

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isLoggedIn, init } = useAuthStore();

  useEffect(() => {
    init();
  }, []);

  return <>{isLoggedIn ? children : <Authorization />}</>;
};
