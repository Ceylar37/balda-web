import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/providers/AuthProvider';
import { RouterProvider } from 'react-router-dom';
import router from './router';

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='theme'>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

