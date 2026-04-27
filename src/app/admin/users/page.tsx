"use client";
import { useState } from "react";
import TopHeader from "@/components/layout/TopHeader";
import { 
  Users, Search, Filter, MoreHorizontal, Shield, 
  Ban, CheckCircle, Mail, UserPlus, Download
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

export default function UserManagement() {
  const [search, setSearch] = useState("");

  const users = [
    { id: 1, name: "Admin User", email: "admin@invoiceglow.app", role: "ADMIN", status: "ACTIVE", joined: "2023-01-01" },
    { id: 2, name: "John Doe", email: "john@example.com", role: "USER", status: "ACTIVE", joined: "2023-10-12" },
    { id: 3, name: "Kojo Mensah", email: "kojo@techghana.com", role: "USER", status: "PENDING", joined: "2023-10-15" },
    { id: 4, name: "Sarah Smith", email: "sarah@design.co", role: "USER", status: "SUSPENDED", joined: "2023-09-20" },
    { id: 5, name: "Alex Chen", email: "alex@photo.pro", role: "USER", status: "ACTIVE", joined: "2023-10-05" },
  ];

  return (
    <>
      <TopHeader title="User Management" subtitle="Manage accounts, permissions and access" />
      
      <div className="page-container">
        {/* Actions Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "12px", flex: 1, maxWidth: "600px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} size={18} />
              <input 
                type="text" 
                placeholder="Search users by name, email or ID..." 
                className="form-input" 
                style={{ paddingLeft: "40px" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-secondary">
              <Filter size={18} />
              Filters
            </button>
          </div>
          
          <div style={{ display: "flex", gap: "12px" }}>
            <button className="btn btn-secondary">
              <Download size={18} />
              Export
            </button>
            <button className="btn btn-primary">
              <UserPlus size={18} />
              Create User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="primary">
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ 
                          width: "36px", height: "36px", borderRadius: "50%", 
                          background: "var(--accent-light)", color: "var(--accent)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 700, fontSize: "0.85rem"
                        }}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{user.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {user.role === "ADMIN" ? <Shield size={14} color="var(--accent)" /> : null}
                        <span style={{ 
                          fontSize: "0.75rem", fontWeight: 700, 
                          color: user.role === "ADMIN" ? "var(--accent)" : "var(--text-secondary)"
                        }}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td>{user.joined}</td>
                    <td>
                      <span className={`badge ${
                        user.status === 'ACTIVE' ? 'badge-paid' : 
                        user.status === 'PENDING' ? 'badge-draft' : 'badge-overdue'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <button className="btn btn-ghost btn-icon" title="Edit Permissions"><Shield size={16} /></button>
                        <button className="btn btn-ghost btn-icon" title="Suspend User"><Ban size={16} /></button>
                        <button className="btn btn-ghost btn-icon"><MoreHorizontal size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-padding" style={{ borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Showing 5 of 124 users</span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn btn-secondary btn-sm" disabled>Previous</button>
              <button className="btn btn-secondary btn-sm">Next</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
