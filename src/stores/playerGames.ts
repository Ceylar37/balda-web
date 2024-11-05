import { getBoardByPlayer } from '@/api';
import { Board } from '@/api/_model';
import { create } from 'zustand';

type State = {
  games: Board[] | null;
  isLoading: boolean;
};

type Action = {
  fetchGames: () => Promise<void>;
};

export const usePlayerGamesStore = create<State & Action>((set) => ({
  games: null,
  isLoading: true,
  fetchGames: async () => {
    set({ isLoading: true });
    const response = await getBoardByPlayer();
    set({ games: response.payload, isLoading: false });
  }
}));
