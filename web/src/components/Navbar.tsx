import type { FC } from 'react';
import clsx from 'clsx';
import { appPaths } from '../pages/routes';

type Theme = 'light' | 'dark';

type NavbarProps = {
  theme: Theme;
  onToggleTheme: () => void;
};

const Navbar: FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="w-full border-b border-border bg-card/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-accent text-white shadow-sm flex items-center justify-center font-semibold">
            WC
          </div>
          <span className="text-lg font-semibold text-text">
            WordCapture
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-4 text-sm font-medium text-muted sm:flex">
            <a className="hover:text-text" href={appPaths.HOME}>
              Dashboard
            </a>
            <a className="hover:text-text" href={appPaths.CAPTURE}>
              Capture
            </a>
            <a className="hover:text-text" href="#">
              Learn
            </a>
          </div>
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-text shadow-sm transition hover:border-accent"
            aria-label="Toggle theme"
          >
            <span
              className={clsx(
                'flex h-5 w-5 items-center justify-center rounded-full',
                theme === 'dark' ? 'bg-gray-700 text-amber-300' : 'bg-yellow-100 text-yellow-600'
              )}
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </span>
            <span className="hidden sm:inline">{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

