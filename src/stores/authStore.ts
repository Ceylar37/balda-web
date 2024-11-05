import { create } from 'zustand';

type State = {
  isLoggedIn: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: string | null;
};

type Action = {
  setLoggedIn: (value: boolean) => void;
  setTokens: (value: { accessToken: string; refreshToken: string } | null) => void;
  init: () => Promise<void>;
  logout: () => Promise<void>;
  setLogin: (value: string | null) => void;
};

export const useAuthStore = create<State & Action>((set) => ({
  isLoggedIn: false,
  isLoading: true,
  accessToken: null,
  refreshToken: null,
  login: null,
  setLoggedIn: (value) => set({ isLoggedIn: value }),
  setTokens: async (value) => {
    await Promise.all([
      localStorage.setItem('accessToken', value?.accessToken ?? ''),
      localStorage.setItem('refreshToken', value?.refreshToken ?? '')
    ]);
    set({
      accessToken: value?.accessToken ?? null,
      refreshToken: value?.refreshToken ?? null,
      isLoggedIn: !!value?.accessToken && !!value?.refreshToken
    });
  },
  init: async () => {
    const [accessToken, refreshToken, login] = await Promise.all([
      localStorage.getItem('accessToken'),
      localStorage.getItem('refreshToken'),
      localStorage.getItem('login')
    ]);
    set({
      accessToken: accessToken,
      refreshToken: refreshToken,
      login,
      isLoading: false,
      isLoggedIn: !!accessToken && !!refreshToken
    });
  },
  logout: async () => {
    await Promise.all([localStorage.removeItem('accessToken'), localStorage.removeItem('refreshToken')]);
    set({ accessToken: null, refreshToken: null, isLoggedIn: false });
  },
  setLogin: (login) => {
    localStorage.setItem('login', login ?? '');
    set({ login });
  }
}));
