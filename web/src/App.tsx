import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import AppRoutes from './pages/routes';

type Theme = 'light' | 'dark';

const App = () => {
  const getPreferredTheme = (): Theme => {
    const stored = localStorage.getItem('theme');
    return stored ? stored as Theme : "light";
  };

  const [theme, setTheme] = useState<Theme>(getPreferredTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-primary text-text transition-colors">
      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
      />
      <main className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <AppRoutes />
      </main>
    </div>
  );
};

export default App;
