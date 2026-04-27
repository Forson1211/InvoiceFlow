import { jsPDF } from "jspdf";
import { formatCurrency, formatDate } from "./utils";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface InvoicePdfData {
  invoiceNumber: string;
  issueDate: Date | string;
  dueDate: Date | string;
  status: string;
  currency: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  notes?: string | null;
  terms?: string | null;
  items: InvoiceItem[];
  client?: {
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    company?: string | null;
  } | null;
  user: {
    businessName?: string | null;
    name?: string | null;
    email?: string | null;
    businessPhone?: string | null;
    businessAddress?: string | null;
  };
}

export function generateInvoicePdf(invoice: InvoicePdfData): Blob {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = margin;

  // ── Header background ──
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageW, 50, "F");

  // ── Brand ──
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("InvoiceGlow", margin, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  const bizName =
    invoice.user.businessName || invoice.user.name || "Your Business";
  doc.text(bizName, margin, y + 16);
  if (invoice.user.businessPhone)
    doc.text(invoice.user.businessPhone, margin, y + 22);
  if (invoice.user.businessAddress)
    doc.text(invoice.user.businessAddress, margin, y + 28);

  // ── Invoice label (right side) ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(99, 102, 241); // indigo
  doc.text("INVOICE", pageW - margin, y + 10, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`#${invoice.invoiceNumber}`, pageW - margin, y + 18, { align: "right" });
  doc.text(`Issued: ${formatDate(invoice.issueDate)}`, pageW - margin, y + 24, { align: "right" });
  doc.text(`Due: ${formatDate(invoice.dueDate)}`, pageW - margin, y + 30, { align: "right" });

  y = 60;

  // ── Bill To ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(99, 102, 241);
  doc.text("BILL TO", margin, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  const clientName = invoice.client?.name || "N/A";
  doc.text(clientName, margin, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  let clientY = y + 13;
  if (invoice.client?.company) { doc.text(invoice.client.company, margin, clientY); clientY += 5; }
  if (invoice.client?.email) { doc.text(invoice.client.email, margin, clientY); clientY += 5; }
  if (invoice.client?.phone) { doc.text(invoice.client.phone, margin, clientY); clientY += 5; }
  if (invoice.client?.address) { doc.text(invoice.client.address, margin, clientY); }

  // ── Status badge ──
  const statusColors: Record<string, [number, number, number]> = {
    PAID: [16, 185, 129],
    SENT: [99, 102, 241],
    DRAFT: [100, 116, 139],
    OVERDUE: [239, 68, 68],
    CANCELLED: [100, 116, 139],
  };
  const [r, g, b] = statusColors[invoice.status] || [100, 116, 139];
  doc.setFillColor(r, g, b);
  doc.roundedRect(pageW - margin - 30, y - 2, 30, 10, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(invoice.status, pageW - margin - 15, y + 5, { align: "center" });

  y = 105;

  // ── Items table header ──
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, pageW - margin * 2, 9, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("DESCRIPTION", margin + 3, y + 6);
  doc.text("QTY", pageW - 100, y + 6, { align: "right" });
  doc.text("UNIT PRICE", pageW - 65, y + 6, { align: "right" });
  doc.text("AMOUNT", pageW - margin, y + 6, { align: "right" });

  y += 12;

  // ── Items ──
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  invoice.items.forEach((item, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(250, 251, 252);
      doc.rect(margin, y - 3, pageW - margin * 2, 9, "F");
    }
    doc.setTextColor(30, 41, 59);
    doc.text(item.description, margin + 3, y + 3);
    doc.setTextColor(100, 116, 139);
    doc.text(item.quantity.toString(), pageW - 100, y + 3, { align: "right" });
    doc.text(formatCurrency(item.unitPrice, invoice.currency), pageW - 65, y + 3, { align: "right" });
    doc.setTextColor(30, 41, 59);
    doc.text(formatCurrency(item.amount, invoice.currency), pageW - margin, y + 3, { align: "right" });
    y += 10;
  });

  y += 5;

  // ── Divider ──
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // ── Totals ──
  const totalsX = pageW - margin - 70;
  const valueX = pageW - margin;

  const addTotalRow = (label: string, value: string, bold = false, highlight = false) => {
    if (highlight) {
      doc.setFillColor(99, 102, 241);
      doc.rect(totalsX - 5, y - 4, 75, 10, "F");
      doc.setTextColor(255, 255, 255);
    } else {
      doc.setTextColor(100, 116, 139);
    }
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 10 : 9);
    doc.text(label, totalsX, y + 3);
    doc.text(value, valueX, y + 3, { align: "right" });
    y += 10;
  };

  addTotalRow("Subtotal", formatCurrency(invoice.subtotal, invoice.currency));
  if (invoice.discount > 0) addTotalRow(`Discount (${invoice.discount}%)`, `-${formatCurrency((invoice.subtotal * invoice.discount) / 100, invoice.currency)}`);
  if (invoice.taxRate > 0) addTotalRow(`Tax (${invoice.taxRate}%)`, formatCurrency(invoice.taxAmount, invoice.currency));
  addTotalRow("TOTAL DUE", formatCurrency(invoice.total, invoice.currency), true, true);

  y += 10;

  // ── Notes & Terms ──
  if (invoice.notes) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("NOTES", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(invoice.notes, margin, y + 6, { maxWidth: pageW - margin * 2 });
    y += 16;
  }

  if (invoice.terms) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("TERMS & CONDITIONS", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(invoice.terms, margin, y + 6, { maxWidth: pageW - margin * 2 });
    y += 16;
  }

  // ── Footer ──
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFillColor(15, 23, 42);
  doc.rect(0, pageH - 18, pageW, 18, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Thank you for your business!", pageW / 2, pageH - 8, { align: "center" });
  doc.text("Generated by InvoiceGlow · invoiceglow.app", pageW / 2, pageH - 3, { align: "center" });

  return doc.output("blob");
}
