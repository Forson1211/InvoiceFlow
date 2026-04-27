"use client";
import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Client } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { api } from "@/lib/api";

const itemSchema = z.object({
  description: z.string().min(1, "Required"),
  quantity: z.number().positive("Must be > 0"),
  unitPrice: z.number().min(0, "Must be ≥ 0"),
});

const formSchema = z.object({
  clientId: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  currency: z.string(),
  taxRate: z.number().min(0).max(100),
  discount: z.number().min(0).max(100),
  notes: z.string().optional(),
  terms: z.string().optional(),
  items: z.array(itemSchema).min(1, "Add at least one item"),
});

type FormValues = z.infer<typeof formSchema>;

const CURRENCIES = ["GHS", "USD", "EUR", "GBP", "NGN", "KES"];

const defaultTerms = "Payment is due within the specified period. Late payments may incur additional charges.";

interface InvoiceFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: FormValues) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export default function InvoiceForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Create Invoice",
}: InvoiceFormProps) {
  const [clients, setClients] = useState<Client[]>([]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: "GHS",
      taxRate: 0,
      discount: 0,
      terms: defaultTerms,
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  // Fetch clients for dropdown
  useEffect(() => {
    api.clients
      .list()
      .then((res: any) => setClients(res.clients))
      .catch(() => {});
  }, []);

  // Live totals
  const watchedItems = watch("items");
  const currency = watch("currency");
  const taxRate = watch("taxRate") || 0;
  const discount = watch("discount") || 0;

  const subtotal = watchedItems.reduce(
    (s, item) => s + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  const discountAmt = (subtotal * discount) / 100;
  const taxable = subtotal - discountAmt;
  const taxAmount = (taxable * taxRate) / 100;
  const total = taxable + taxAmount;

  const today = new Date().toISOString().split("T")[0];
  const defaultDue = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Client & Dates */}
      <div className="card card-padding">
        <h4 style={{ marginBottom: "16px", color: "var(--text-secondary)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Invoice Details
        </h4>
        <div className="grid-3" style={{ gap: "14px" }}>
          <div className="form-group">
            <label className="form-label">Client</label>
            <select className="form-select" {...register("clientId")}>
              <option value="">No client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ""}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Due Date *</label>
            <input
              type="date"
              className="form-input"
              defaultValue={defaultDue}
              min={today}
              {...register("dueDate")}
            />
            {errors.dueDate && <span className="form-error">{errors.dueDate.message}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Currency</label>
            <select className="form-select" {...register("currency")}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="card card-padding">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h4 style={{ color: "var(--text-secondary)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Line Items
          </h4>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}
          >
            <Plus size={14} /> Add Item
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th style={{ textAlign: "left", padding: "8px 4px", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                  Description
                </th>
                <th style={{ textAlign: "right", padding: "8px 4px", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", width: "80px" }}>
                  Qty
                </th>
                <th style={{ textAlign: "right", padding: "8px 4px", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", width: "120px" }}>
                  Unit Price
                </th>
                <th style={{ textAlign: "right", padding: "8px 4px", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", width: "110px" }}>
                  Amount
                </th>
                <th style={{ width: "36px" }} />
              </tr>
            </thead>
            <tbody>
              {fields.map((field, idx) => {
                const qty = Number(watchedItems[idx]?.quantity) || 0;
                const price = Number(watchedItems[idx]?.unitPrice) || 0;
                const amount = qty * price;
                return (
                  <tr key={field.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 4px" }}>
                      <input
                        className="form-input"
                        placeholder="Service or product description"
                        {...register(`items.${idx}.description`)}
                      />
                      {errors.items?.[idx]?.description && (
                        <span className="form-error">{errors.items[idx]?.description?.message}</span>
                      )}
                    </td>
                    <td style={{ padding: "8px 4px" }}>
                      <input
                        type="number"
                        className="form-input"
                        style={{ textAlign: "right" }}
                        min="0.01"
                        step="0.01"
                        {...register(`items.${idx}.quantity`, { valueAsNumber: true })}
                      />
                    </td>
                    <td style={{ padding: "8px 4px" }}>
                      <input
                        type="number"
                        className="form-input"
                        style={{ textAlign: "right" }}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...register(`items.${idx}.unitPrice`, { valueAsNumber: true })}
                      />
                    </td>
                    <td style={{ padding: "8px 4px", textAlign: "right", fontWeight: 600, color: "var(--text-primary)", fontSize: "0.875rem" }}>
                      {formatCurrency(amount, currency)}
                    </td>
                    <td style={{ padding: "8px 4px", textAlign: "center" }}>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() => remove(idx)}
                          style={{ color: "var(--danger)" }}
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {errors.items?.root && (
          <p className="form-error" style={{ marginTop: "8px" }}>{errors.items.root.message}</p>
        )}
      </div>

      {/* Totals & Notes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px" }}>
        {/* Notes */}
        <div className="card card-padding" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div className="form-group">
            <label className="form-label">Notes to Client</label>
            <textarea
              className="form-textarea"
              placeholder="Thank you for your business!"
              rows={3}
              {...register("notes")}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Terms & Conditions</label>
            <textarea
              className="form-textarea"
              rows={3}
              {...register("terms")}
            />
          </div>
        </div>

        {/* Totals Summary */}
        <div className="card card-padding" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h4 style={{ color: "var(--text-secondary)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
            Summary
          </h4>

          <div className="form-group">
            <label className="form-label">Discount (%)</label>
            <input type="number" className="form-input" min="0" max="100" step="0.1" {...register("discount", { valueAsNumber: true })} />
          </div>

          <div className="form-group">
            <label className="form-label">Tax Rate (%)</label>
            <input type="number" className="form-input" min="0" max="100" step="0.1" {...register("taxRate", { valueAsNumber: true })} />
          </div>

          <div className="divider" style={{ margin: "4px 0" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { label: "Subtotal", value: formatCurrency(subtotal, currency) },
              discount > 0 ? { label: `Discount (${discount}%)`, value: `-${formatCurrency(discountAmt, currency)}` } : null,
              taxRate > 0 ? { label: `Tax (${taxRate}%)`, value: formatCurrency(taxAmount, currency) } : null,
            ]
              .filter(Boolean)
              .map((row) => (
                <div key={row!.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>{row!.label}</span>
                  <span style={{ color: "var(--text-secondary)" }}>{row!.value}</span>
                </div>
              ))}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 12px",
                background: "var(--accent-light)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--accent-glow)",
              }}
            >
              <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>Total</span>
              <span style={{ fontWeight: 800, color: "var(--accent)", fontSize: "1.1rem" }}>
                {formatCurrency(total, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <button type="button" className="btn btn-secondary" onClick={() => history.back()}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
          {isLoading ? <span className="spinner" /> : submitLabel}
        </button>
      </div>
    </form>
  );
}
