import { CreateGame } from '@/views/create-game';
import { Game } from '@/views/game';
import { MyGames } from '@/views/my-games';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MyGames />
      },
      {
        path: '/create-game',
        element: <CreateGame />
      },
      {
        path: '/:id',
        element: <Game />
      }
    ]
  }
]);

export default router;
