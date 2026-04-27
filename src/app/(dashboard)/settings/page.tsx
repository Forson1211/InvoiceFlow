"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TopHeader from "@/components/layout/TopHeader";
import { api } from "@/lib/api";
import { useUserStore } from "@/store";
import { toast } from "@/components/ui/Toast";
import { Save, User, Building, CreditCard, Percent } from "lucide-react";

const CURRENCIES = ["GHS", "USD", "EUR", "GBP", "NGN", "KES"];

const settingsSchema = z.object({
  name: z.string().min(2, "Name is required"),
  businessName: z.string().optional(),
  businessPhone: z.string().optional(),
  businessAddress: z.string().optional(),
  currency: z.string(),
  taxRate: z.number().min(0).max(100),
});

type FormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { user, setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    api.settings.get()
      .then((res: any) => {
        setUser(res.user);
        reset(res.user);
      })
      .catch(() => toast("Failed to load settings", "error"))
      .finally(() => setIsLoading(false));
  }, [setUser, reset]);

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      const res: any = await api.settings.update(data);
      setUser(res.user);
      reset(res.user);
      toast("Settings updated successfully", "success");
    } catch (err: any) {
      toast(err.message || "Failed to update settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <TopHeader title="Settings" />
        <div className="page-container" style={{ display: "flex", justifyContent: "center", paddingTop: "80px" }}>
          <div className="spinner spinner-lg" />
        </div>
      </>
    );
  }

  return (
    <>
      <TopHeader title="Settings" subtitle="Manage your business profile and preferences" />
      <div className="page-container" style={{ maxWidth: "800px" }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Profile Section */}
          <div className="card">
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="stat-icon" style={{ background: "var(--accent-light)", width: "32px", height: "32px" }}>
                <User size={16} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: "1rem" }}>Personal Profile</h3>
            </div>
            <div className="card-padding grid-2" style={{ gap: "20px" }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" {...register("name")} />
                {errors.name && <span className="form-error">{errors.name.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" value={user?.email || ""} disabled style={{ opacity: 0.7, cursor: "not-allowed" }} />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Email cannot be changed</span>
              </div>
            </div>
          </div>

          {/* Business Section */}
          <div className="card">
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="stat-icon" style={{ background: "var(--success-light)", width: "32px", height: "32px" }}>
                <Building size={16} color="var(--success)" />
              </div>
              <h3 style={{ fontSize: "1rem" }}>Business Details</h3>
            </div>
            <div className="card-padding" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="grid-2" style={{ gap: "20px" }}>
                <div className="form-group">
                  <label className="form-label">Business Name</label>
                  <input className="form-input" placeholder="Acme Corp" {...register("businessName")} />
                </div>
                <div className="form-group">
                  <label className="form-label">Business Phone</label>
                  <input className="form-input" placeholder="+233 24 000 0000" {...register("businessPhone")} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Business Address</label>
                <textarea className="form-textarea" placeholder="123 Main St, Accra, Ghana" rows={3} {...register("businessAddress")} />
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
                These details will appear on your generated invoices.
              </p>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="card">
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="stat-icon" style={{ background: "var(--warning-light)", width: "32px", height: "32px" }}>
                <CreditCard size={16} color="var(--warning)" />
              </div>
              <h3 style={{ fontSize: "1rem" }}>Invoice Preferences</h3>
            </div>
            <div className="card-padding grid-2" style={{ gap: "20px" }}>
              <div className="form-group">
                <label className="form-label">Default Currency</label>
                <select className="form-select" {...register("currency")}>
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Default Tax Rate (%)</label>
                <div className="search-wrapper">
                  <Percent size={15} className="search-icon" />
                  <input type="number" className="form-input" style={{ paddingLeft: "38px" }} min="0" max="100" step="0.1" {...register("taxRate")} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={!isDirty || isSaving}>
              {isSaving ? <span className="spinner" /> : <><Save size={18} /> Save Settings</>}
            </button>
          </div>

        </form>
      </div>
    </>
  );
}
