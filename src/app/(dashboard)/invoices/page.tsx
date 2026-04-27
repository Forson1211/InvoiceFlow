"use client";
import { useEffect, useState, useCallback } from "react";
import TopHeader from "@/components/layout/TopHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { api } from "@/lib/api";
import { useInvoiceStore } from "@/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";
import type { Invoice, InvoiceStatus } from "@/types";
import {
  Plus, Search, Filter, Download, Send, CheckCircle,
  Trash2, Eye, MoreHorizontal, FileText,
} from "lucide-react";
import Link from "next/link";

const STATUSES: (InvoiceStatus | "ALL")[] = ["ALL", "DRAFT", "SENT", "PAID", "OVERDUE"];

export default function InvoicesPage() {
  const { invoices, setInvoices, removeInvoice, updateInvoice, isLoading, setLoading } = useInvoiceStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "ALL">("ALL");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    api.invoices
      .list(statusFilter !== "ALL" ? { status: statusFilter } : undefined)
      .then((res: any) => setInvoices(res.invoices))
      .catch(() => toast("Failed to load invoices", "error"))
      .finally(() => setLoading(false));
  }, [statusFilter, setInvoices, setLoading]);

  useEffect(() => { load(); }, [load]);

  const filtered = invoices.filter((inv) =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.client?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = async (id: string) => {
    setActionLoading(id + "-send");
    try {
      const res: any = await api.invoices.send(id);
      updateInvoice(id, { status: "SENT" });
      toast(res.emailSent ? "Invoice sent via email!" : "Invoice marked as sent", "success");
    } catch {
      toast("Failed to send invoice", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkPaid = async (id: string) => {
    setActionLoading(id + "-paid");
    try {
      await api.invoices.markPaid(id);
      updateInvoice(id, { status: "PAID" });
      toast("Invoice marked as paid!", "success");
    } catch {
      toast("Failed to mark as paid", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setActionLoading("delete");
    try {
      await api.invoices.delete(deleteId);
      removeInvoice(deleteId);
      toast("Invoice deleted", "success");
    } catch {
      toast("Failed to delete invoice", "error");
    } finally {
      setActionLoading(null);
      setDeleteId(null);
    }
  };

  const handleDownloadPdf = async (inv: Invoice) => {
    const { generateInvoicePdf } = await import("@/lib/pdf");
    const user = { name: "Your Business" };
    const blob = generateInvoicePdf({ ...inv, issueDate: inv.issueDate, user });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${inv.invoiceNumber}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <TopHeader title="Invoices" subtitle={`${invoices.length} total`} />
      <div className="page-container">
        {/* Toolbar */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div className="search-wrapper" style={{ flex: 1, minWidth: "200px" }}>
            <Search size={15} className="search-icon" />
            <input
              className="search-input"
              placeholder="Search by number or client…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          {/* Status filter tabs */}
          <div style={{ display: "flex", gap: "4px", background: "var(--bg-elevated)", borderRadius: "var(--radius)", padding: "3px", border: "1px solid var(--border)" }}>
            {STATUSES.map((s) => (
              <button
                key={s}
                className={`btn btn-sm ${statusFilter === s ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setStatusFilter(s)}
                style={{ padding: "5px 12px", fontSize: "0.78rem" }}
              >
                {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <Link href="/invoices/new" className="btn btn-primary">
            <Plus size={16} /> New Invoice
          </Link>
        </div>

        {/* Table */}
        <div className="card">
          <div className="table-wrapper" style={{ border: "none", borderRadius: "var(--radius-lg)" }}>
            <table>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Client</th>
                  <th>Issued</th>
                  <th>Due Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(7)].map((_, j) => (
                        <td key={j}>
                          <div className="animate-pulse" style={{ height: "14px", background: "var(--bg-elevated)", borderRadius: "4px" }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="empty-state">
                        <div className="empty-icon"><FileText size={24} /></div>
                        <h4>No invoices found</h4>
                        <p style={{ fontSize: "0.875rem" }}>
                          {search || statusFilter !== "ALL" ? "Try adjusting your filters" : "Create your first invoice to get started"}
                        </p>
                        {!search && statusFilter === "ALL" && (
                          <Link href="/invoices/new" className="btn btn-primary" style={{ marginTop: "8px" }}>
                            <Plus size={15} /> Create Invoice
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((inv) => {
                    const isOverdue = inv.status === "SENT" && new Date(inv.dueDate) < new Date();
                    return (
                      <tr key={inv.id}>
                        <td className="primary">
                          <Link href={`/invoices/${inv.id}`} style={{ color: "var(--accent)" }}>
                            #{inv.invoiceNumber}
                          </Link>
                        </td>
                        <td>{inv.client?.name ?? <span style={{ color: "var(--text-muted)" }}>No client</span>}</td>
                        <td>{formatDate(inv.issueDate)}</td>
                        <td style={{ color: isOverdue ? "var(--danger)" : "inherit" }}>
                          {formatDate(inv.dueDate)}
                        </td>
                        <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                          {formatCurrency(inv.total, inv.currency)}
                        </td>
                        <td><StatusBadge status={inv.status} /></td>
                        <td>
                          <div style={{ display: "flex", gap: "4px", justifyContent: "flex-end" }}>
                            <Link href={`/invoices/${inv.id}`} className="btn btn-ghost btn-icon btn-sm" title="View">
                              <Eye size={14} />
                            </Link>
                            {inv.status === "DRAFT" && (
                              <button
                                className="btn btn-ghost btn-icon btn-sm"
                                title="Send Invoice"
                                onClick={() => handleSend(inv.id)}
                                disabled={actionLoading === inv.id + "-send"}
                              >
                                {actionLoading === inv.id + "-send" ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <Send size={14} />}
                              </button>
                            )}
                            {(inv.status === "SENT" || inv.status === "OVERDUE") && (
                              <button
                                className="btn btn-ghost btn-icon btn-sm"
                                title="Mark as Paid"
                                onClick={() => handleMarkPaid(inv.id)}
                                disabled={actionLoading === inv.id + "-paid"}
                                style={{ color: "var(--success)" }}
                              >
                                {actionLoading === inv.id + "-paid" ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <CheckCircle size={14} />}
                              </button>
                            )}
                            <button
                              className="btn btn-ghost btn-icon btn-sm"
                              title="Download PDF"
                              onClick={() => handleDownloadPdf(inv)}
                            >
                              <Download size={14} />
                            </button>
                            <button
                              className="btn btn-ghost btn-icon btn-sm"
                              title="Delete"
                              onClick={() => setDeleteId(inv.id)}
                              style={{ color: "var(--danger)" }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        message="This invoice will be permanently deleted. This action cannot be undone."
        confirmLabel="Delete Invoice"
        loading={actionLoading === "delete"}
      />
    </>
  );
}
