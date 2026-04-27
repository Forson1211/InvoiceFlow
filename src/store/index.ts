import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Invoice, Client, DashboardStats, User } from "@/types";

interface InvoiceStore {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  isLoading: boolean;
  error: string | null;
  setInvoices: (invoices: Invoice[]) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  removeInvoice: (id: string) => void;
  selectInvoice: (invoice: Invoice | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoices: [],
  selectedInvoice: null,
  isLoading: false,
  error: null,
  setInvoices: (invoices) => set({ invoices }),
  addInvoice: (invoice) =>
    set((state) => ({ invoices: [invoice, ...state.invoices] })),
  updateInvoice: (id, updated) =>
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id ? { ...inv, ...updated } : inv
      ),
      selectedInvoice:
        state.selectedInvoice?.id === id
          ? { ...state.selectedInvoice, ...updated }
          : state.selectedInvoice,
    })),
  removeInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.filter((inv) => inv.id !== id),
    })),
  selectInvoice: (invoice) => set({ selectedInvoice: invoice }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

interface ClientStore {
  clients: Client[];
  selectedClient: Client | null;
  isLoading: boolean;
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  removeClient: (id: string) => void;
  selectClient: (client: Client | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useClientStore = create<ClientStore>((set) => ({
  clients: [],
  selectedClient: null,
  isLoading: false,
  setClients: (clients) => set({ clients }),
  addClient: (client) =>
    set((state) => ({ clients: [client, ...state.clients] })),
  updateClient: (id, updated) =>
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === id ? { ...c, ...updated } : c
      ),
    })),
  removeClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== id),
    })),
  selectClient: (client) => set({ selectedClient: client }),
  setLoading: (isLoading) => set({ isLoading }),
}));

interface UIStore {
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  theme: "dark" | "light" | "system";
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light" | "system") => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      mobileSidebarOpen: false,
      theme: "system",
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleMobileSidebar: () =>
        set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : state.theme === "light" ? "system" : "dark",
        })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: "invoiceflow-ui" }
  )
);

interface DashboardStore {
  stats: DashboardStats | null;
  isLoading: boolean;
  setStats: (stats: DashboardStats) => void;
  setLoading: (loading: boolean) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: null,
  isLoading: false,
  setStats: (stats) => set({ stats }),
  setLoading: (isLoading) => set({ isLoading }),
}));

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
