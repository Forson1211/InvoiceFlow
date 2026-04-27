"use client";
import { useEffect } from "react";
import { useUIStore } from "@/store";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if ((theme as string) === "system") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme as string);
    }
    
    // Smooth transition
    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease";
  }, [theme]);

  return <>{children}</>;
}
