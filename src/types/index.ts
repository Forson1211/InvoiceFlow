export interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  businessName?: string | null;
  businessPhone?: string | null;
  businessAddress?: string | null;
  businessLogo?: string | null;
  currency: string;
  taxRate: number;
}

export interface Client {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  company?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  invoices?: Invoice[];
  _count?: { invoices: number };
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";

export interface Invoice {
  id: string;
  userId: string;
  clientId?: string | null;
  invoiceNumber: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  currency: string;
  taxRate: number;
  discount: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  notes?: string | null;
  terms?: string | null;
  pdfUrl?: string | null;
  paymentLink?: string | null;
  sentAt?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
  client?: Client | null;
  items: InvoiceItem[];
  payments?: Payment[];
}

export type PaymentMethod = "MOBILE_MONEY" | "BANK_TRANSFER" | "CASH" | "CARD";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  provider?: string | null;
  reference?: string | null;
  status: PaymentStatus;
  phoneNumber?: string | null;
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  pendingAmount: number;
  overdueCount: number;
  paidCount: number;
  totalInvoices: number;
  totalClients: number;
  recentInvoices: Invoice[];
  monthlyRevenue: { month: string; revenue: number }[];
}

export interface InvoiceFormData {
  clientId?: string;
  dueDate: string;
  currency: string;
  taxRate: number;
  discount: number;
  notes?: string;
  terms?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
}
