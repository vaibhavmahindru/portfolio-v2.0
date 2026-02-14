import { createContext, useContext, type ReactNode } from "react";

/**
 * Theme context — dark mode only.
 * Kept as a context so existing consumers (terminal, etc.) don't break,
 * but the toggle is now a no-op.
 */
type Theme = "dark";

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx>({ theme: "dark", toggle: () => {} });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeContext.Provider value={{ theme: "dark", toggle: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};
