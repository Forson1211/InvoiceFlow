"use client";
import { Bell, Menu, Plus, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useUIStore } from "@/store";

interface TopHeaderProps {
  title: string;
  subtitle?: string;
}

export default function TopHeader({ title, subtitle }: TopHeaderProps) {
  const { toggleSidebar, toggleMobileSidebar, theme, toggleTheme } = useUIStore();

  const handleToggle = () => {
    if (window.innerWidth <= 768) {
      toggleMobileSidebar();
    } else {
      toggleSidebar();
    }
  };

  return (
    <header className="top-header">
      <button
        onClick={handleToggle}
        className="btn btn-ghost btn-icon"
        aria-label="Toggle sidebar"
      >
        <Menu size={18} />
      </button>

      <div style={{ flex: 1 }}>
        <div className="header-title">{title}</div>
        {subtitle && (
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "1px" }}>
            {subtitle}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Link href="/invoices/new" className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span className="btn-text">New Invoice</span>
        </Link>

        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-icon"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button className="btn btn-ghost btn-icon" aria-label="Notifications">
          <Bell size={17} />
        </button>
      </div>
    </header>
  );
}
