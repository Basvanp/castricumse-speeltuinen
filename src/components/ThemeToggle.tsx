import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 rounded-full"
        disabled
      >
        <div className="w-5 h-5 animate-pulse bg-muted-foreground/20 rounded" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-10 h-10 p-0 rounded-full transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 transition-all duration-300 hover:rotate-12" />
      ) : (
        <Sun className="h-5 w-5 transition-all duration-300 hover:rotate-12" />
      )}
    </Button>
  );
};

export default ThemeToggle; 