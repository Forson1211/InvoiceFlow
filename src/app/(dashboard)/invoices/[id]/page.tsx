"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import TopHeader from "@/components/layout/TopHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";
import type { Invoice } from "@/types";
import {
  ArrowLeft, Download, Send, CheckCircle, Trash2,
  Edit, User, Calendar, Hash,
} from "lucide-react";

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    api.invoices.get(id)
      .then((res: any) => setInvoice(res.invoice))
      .catch(() => toast("Failed to load invoice", "error"))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSend = async () => {
    setActionLoading("send");
    try {
      const res: any = await api.invoices.send(id);
      setInvoice((prev) => prev ? { ...prev, status: "SENT" } : prev);
      toast(res.emailSent ? "Invoice sent via email!" : "Invoice marked as sent", "success");
    } catch { toast("Failed to send invoice", "error"); }
    finally { setActionLoading(null); }
  };

  const handleMarkPaid = async () => {
    setActionLoading("paid");
    try {
      await api.invoices.markPaid(id);
      setInvoice((prev) => prev ? { ...prev, status: "PAID" } : prev);
      toast("Invoice marked as paid!", "success");
    } catch { toast("Failed to mark as paid", "error"); }
    finally { setActionLoading(null); }
  };

  const handleDelete = async () => {
    setActionLoading("delete");
    try {
      await api.invoices.delete(id);
      toast("Invoice deleted", "success");
      router.push("/invoices");
    } catch { toast("Failed to delete", "error"); }
    finally { setActionLoading(null); setShowDelete(false); }
  };

  const handleDownload = async () => {
    if (!invoice) return;
    const { generateInvoicePdf } = await import("@/lib/pdf");
    const blob = generateInvoicePdf({ ...invoice, user: { name: "Your Business" } });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${invoice.invoiceNumber}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return (
    <>
      <TopHeader title="Invoice" />
      <div className="page-container" style={{ display: "flex", justifyContent: "center", paddingTop: "80px" }}>
        <div className="spinner spinner-lg" />
      </div>
    </>
  );

  if (!invoice) return (
    <>
      <TopHeader title="Invoice Not Found" />
      <div className="page-container">
        <div className="empty-state">
          <h4>Invoice not found</h4>
          <Link href="/invoices" className="btn btn-primary">Back to Invoices</Link>
        </div>
      </div>
    </>
  );

  const isOverdue = invoice.status === "SENT" && new Date(invoice.dueDate) < new Date();

  return (
    <>
      <TopHeader title={`Invoice #${invoice.invoiceNumber}`} />
      <div className="page-container" style={{ maxWidth: "880px" }}>
        {/* Action Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "10px" }}>
          <Link href="/invoices" className="btn btn-ghost btn-sm">
            <ArrowLeft size={15} /> Back
          </Link>
          <div style={{ display: "flex", gap: "8px" }}>
            {invoice.status === "DRAFT" && (
              <Link href={`/invoices/${id}/edit`} className="btn btn-secondary btn-sm">
                <Edit size={14} /> Edit
              </Link>
            )}
            {invoice.status === "DRAFT" && (
              <button className="btn btn-primary btn-sm" onClick={handleSend} disabled={!!actionLoading}>
                {actionLoading === "send" ? <span className="spinner" /> : <><Send size={14} /> Send</>}
              </button>
            )}
            {(invoice.status === "SENT" || isOverdue) && (
              <button className="btn btn-secondary btn-sm" onClick={handleMarkPaid} disabled={!!actionLoading}
                style={{ color: "var(--success)", borderColor: "var(--success)" }}>
                {actionLoading === "paid" ? <span className="spinner" /> : <><CheckCircle size={14} /> Mark Paid</>}
              </button>
            )}
            <button className="btn btn-secondary btn-sm" onClick={handleDownload}>
              <Download size={14} /> PDF
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => setShowDelete(true)}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Invoice Card */}
        <div className="card">
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #0f172a, #1e293b)",
            padding: "32px 36px",
            borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "20px",
          }}>
            <div>
              <div style={{ fontSize: "1.4rem", fontWeight: 900, background: "linear-gradient(135deg, #fff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                InvoiceGlow
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4px" }}>
                Professional Invoicing
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Invoice</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent)" }}>#{invoice.invoiceNumber}</div>
              <div style={{ marginTop: "8px" }}><StatusBadge status={invoice.status} /></div>
            </div>
          </div>

          {/* Meta Info */}
          <div style={{ padding: "28px 36px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
            <div>
              <div style={{ fontSize: "0.72rem", color: "var(--accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Bill To</div>
              {invoice.client ? (
                <>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem" }}>{invoice.client.name}</div>
                  {invoice.client.company && <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{invoice.client.company}</div>}
                  {invoice.client.email && <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{invoice.client.email}</div>}
                  {invoice.client.phone && <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{invoice.client.phone}</div>}
                </>
              ) : (
                <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No client assigned</span>
              )}
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", color: "var(--accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Issue Date</div>
              <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{formatDate(invoice.issueDate)}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", color: isOverdue ? "var(--danger)" : "var(--accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                {isOverdue ? "⚠ Overdue Since" : "Due Date"}
              </div>
              <div style={{ fontWeight: 600, color: isOverdue ? "var(--danger)" : "var(--text-primary)" }}>
                {formatDate(invoice.dueDate)}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div style={{ padding: "0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--bg-elevated)" }}>
                  <th style={{ padding: "12px 36px", textAlign: "left", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Description</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", width: "80px" }}>Qty</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", width: "120px" }}>Unit Price</th>
                  <th style={{ padding: "12px 36px", textAlign: "right", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", width: "120px" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, i) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                    <td style={{ padding: "14px 36px", color: "var(--text-primary)", fontWeight: 500 }}>{item.description}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right", color: "var(--text-muted)" }}>{item.quantity}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right", color: "var(--text-muted)" }}>{formatCurrency(item.unitPrice, invoice.currency)}</td>
                    <td style={{ padding: "14px 36px", textAlign: "right", color: "var(--text-primary)", fontWeight: 600 }}>{formatCurrency(item.amount, invoice.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div style={{ padding: "20px 36px 28px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: "280px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
                <span style={{ color: "var(--text-secondary)" }}>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
              </div>
              {invoice.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Discount ({invoice.discount}%)</span>
                  <span style={{ color: "var(--success)" }}>-{formatCurrency((invoice.subtotal * invoice.discount) / 100, invoice.currency)}</span>
                </div>
              )}
              {invoice.taxRate > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Tax ({invoice.taxRate}%)</span>
                  <span style={{ color: "var(--text-secondary)" }}>{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "var(--accent-light)", borderRadius: "var(--radius)", border: "1px solid var(--accent-glow)", marginTop: "4px" }}>
                <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>Total Due</span>
                <span style={{ fontWeight: 800, color: "var(--accent)", fontSize: "1.15rem" }}>{formatCurrency(invoice.total, invoice.currency)}</span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          {(invoice.notes || invoice.terms) && (
            <div style={{ padding: "20px 36px", borderTop: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              {invoice.notes && (
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Notes</div>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Terms</div>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{invoice.terms}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice #${invoice.invoiceNumber}? This cannot be undone.`}
        confirmLabel="Delete"
        loading={actionLoading === "delete"}
      />
    </>
  );
}
