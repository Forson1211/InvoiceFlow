"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  CreditCard,
} from "lucide-react";
import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";

const navItems = [
  {
    section: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Invoices", href: "/invoices", icon: FileText },
      { label: "Clients", href: "/clients", icon: Users },
      { label: "Payments", href: "/payments", icon: CreditCard },
    ],
  },
  {
    section: "Account",
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

const adminNavItems = [
  {
    section: "Admin Control",
    items: [
      { label: "Admin Overview", href: "/admin", icon: LayoutDashboard },
      { label: "User Management", href: "/admin/users", icon: Users },
      { label: "System Config", href: "/admin/settings", icon: Settings },
      { label: "Audit Logs", href: "/admin/logs", icon: FileText },
    ],
  },
  {
    section: "Return",
    items: [
      { label: "Back to App", href: "/dashboard", icon: ChevronLeft },
    ],
  },
];

export default function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();
  
  const currentNavItems = isAdmin ? adminNavItems : navItems;

  return (
    <>
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside className={cn(
        "sidebar", 
        !sidebarOpen && "collapsed",
        mobileSidebarOpen && "mobile-open"
      )}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-logo">
            <Zap size={16} />
          </div>
          <span className="brand-name nav-label">InvoiceFlow</span>
          
          {/* Mobile Close Button */}
          <button 
            className="mobile-close-btn"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {currentNavItems.map((section) => (
            <div key={section.section} style={{ marginBottom: "20px" }}>
              <div className="nav-section-label">{section.section}</div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn("nav-item", active && "active")}
                    title={!sidebarOpen ? item.label : undefined}
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <Icon className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="nav-item btn-ghost"
            style={{ width: "100%", border: "none", background: "none" }}
            title={!sidebarOpen ? "Sign out" : undefined}
          >
            <LogOut className="nav-icon" />
            <span className="nav-label">Sign Out</span>
          </button>
        </div>

        {/* Toggle button (Desktop only) */}
        <button
          onClick={toggleSidebar}
          className="sidebar-toggle-btn"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </aside>
    </>
  );
}
