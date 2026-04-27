"use client";
import TopHeader from "@/components/layout/TopHeader";
import { Save, RefreshCw, Palette, Globe, Mail, Shield } from "lucide-react";

export default function AdminSettings() {
  return (
    <>
      <TopHeader title="System Configuration" subtitle="Manage global software settings" />
      
      <div className="page-container">
        <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="card-padding" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "1.1rem" }}>Global Settings</h3>
          </div>
          
          <div className="card-padding">
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Branding */}
              <section>
                <h4 style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Palette size={16} /> Appearance & Branding
                </h4>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Software Name</label>
                    <input type="text" className="form-input" defaultValue="InvoiceGlow" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Primary Color</label>
                    <input type="color" className="form-input" style={{ height: "42px", padding: "4px" }} defaultValue="#4f46e5" />
                  </div>
                </div>
              </section>

              <div className="divider"></div>

              {/* System */}
              <section>
                <h4 style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Globe size={16} /> Localization & Defaults
                </h4>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Default Currency</label>
                    <select className="form-select">
                      <option value="GHS">GHS - Ghanaian Cedi</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Timezone</label>
                    <select className="form-select">
                      <option>UTC (London)</option>
                      <option>GMT+0 (Accra)</option>
                    </select>
                  </div>
                </div>
              </section>

              <div className="divider"></div>

              {/* Security */}
              <section>
                <h4 style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Shield size={16} /> Security Settings
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input type="checkbox" defaultChecked />
                    <span style={{ fontSize: "0.9rem" }}>Enable Email Verification for new users</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input type="checkbox" defaultChecked />
                    <span style={{ fontSize: "0.9rem" }}>Allow self-registration</span>
                  </label>
                </div>
              </section>

              <div className="divider"></div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button className="btn btn-secondary">
                  <RefreshCw size={16} />
                  Reset to Defaults
                </button>
                <button className="btn btn-primary">
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
