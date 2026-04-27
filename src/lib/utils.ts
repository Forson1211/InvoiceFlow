import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "GHS"
): string {
  const symbols: Record<string, string> = {
    GHS: "₵",
    USD: "$",
    EUR: "€",
    GBP: "£",
    NGN: "₦",
    KES: "KSh",
  };
  const symbol = symbols[currency] || currency;
  return `${symbol}${amount.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMM dd, yyyy");
}

export function generateInvoiceNumber(): string {
  const prefix = "INV";
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${year}-${random}`;
}

export function calculateInvoiceTotals(
  items: { quantity: number; unitPrice: number }[],
  taxRate: number = 0,
  discount: number = 0
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;
  return { subtotal, discountAmount, taxAmount, total };
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: "text-gray-400 bg-gray-400/10",
    SENT: "text-blue-400 bg-blue-400/10",
    PAID: "text-emerald-400 bg-emerald-400/10",
    OVERDUE: "text-red-400 bg-red-400/10",
    CANCELLED: "text-gray-500 bg-gray-500/10",
  };
  return colors[status] || "text-gray-400 bg-gray-400/10";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: "Draft",
    SENT: "Sent",
    PAID: "Paid",
    OVERDUE: "Overdue",
    CANCELLED: "Cancelled",
  };
  return labels[status] || status;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "…" : str;
}
