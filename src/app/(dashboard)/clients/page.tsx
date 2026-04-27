"use client";
import { useEffect, useState } from "react";
import TopHeader from "@/components/layout/TopHeader";
import ClientForm from "@/components/forms/ClientForm";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { api } from "@/lib/api";
import { useClientStore } from "@/store";
import { toast } from "@/components/ui/Toast";
import type { Client } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Plus, Search, Edit2, Trash2, Mail, Phone, Users, Building } from "lucide-react";
import Link from "next/link";

export default function ClientsPage() {
  const { clients, setClients, addClient, updateClient, removeClient, isLoading, setLoading } = useClientStore();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.clients.list()
      .then((res: any) => setClients(res.clients))
      .catch(() => toast("Failed to load clients", "error"))
      .finally(() => setLoading(false));
  }, [setLoading, setClients]);

  const filtered = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.company?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (data: any) => {
    setActionLoading(true);
    try {
      if (editingClient) {
        const res: any = await api.clients.update(editingClient.id, data);
        updateClient(editingClient.id, res.client);
        toast("Client updated", "success");
      } else {
        const res: any = await api.clients.create(data);
        addClient(res.client);
        toast("Client created", "success");
      }
      setIsModalOpen(false);
      setEditingClient(null);
    } catch (err: any) {
      toast(err.message || "Operation failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await api.clients.delete(deleteId);
      removeClient(deleteId);
      toast("Client deleted", "success");
    } catch {
      toast("Failed to delete client", "error");
    } finally {
      setActionLoading(false);
      setDeleteId(null);
    }
  };

  const openEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <TopHeader title="Clients" subtitle="Manage your customers" />
      <div className="page-container">
        {/* Toolbar */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
          <div className="search-wrapper" style={{ flex: 1, minWidth: "200px" }}>
            <Search size={15} className="search-icon" />
            <input
              className="search-input"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} /> Add Client
          </button>
        </div>

        {/* Client Grid */}
        <div className="grid-3">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="card card-padding animate-pulse">
                <div style={{ height: "24px", width: "60%", background: "var(--bg-elevated)", borderRadius: "4px", marginBottom: "12px" }} />
                <div style={{ height: "16px", width: "40%", background: "var(--bg-elevated)", borderRadius: "4px", marginBottom: "8px" }} />
                <div style={{ height: "16px", width: "50%", background: "var(--bg-elevated)", borderRadius: "4px" }} />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="card" style={{ gridColumn: "1 / -1" }}>
              <div className="empty-state">
                <div className="empty-icon"><Users size={24} /></div>
                <h4>No clients found</h4>
                <p style={{ fontSize: "0.875rem" }}>
                  {search ? "No clients match your search" : "Add your first client to start creating invoices"}
                </p>
                {!search && (
                  <button className="btn btn-primary" style={{ marginTop: "8px" }} onClick={openCreate}>
                    <Plus size={15} /> Add Client
                  </button>
                )}
              </div>
            </div>
          ) : (
            filtered.map(client => (
              <div key={client.id} className="card card-padding" style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative" }}>
                <div style={{ position: "absolute", top: "20px", right: "20px", display: "flex", gap: "4px" }}>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(client)} title="Edit">
                    <Edit2 size={14} />
                  </button>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setDeleteId(client.id)} title="Delete" style={{ color: "var(--danger)" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
                
                <div>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "4px", paddingRight: "60px" }}>{client.name}</h3>
                  {client.company && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      <Building size={12} /> {client.company}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.875rem" }}>
                  {client.email ? (
                    <a href={`mailto:${client.email}`} style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)" }}>
                      <Mail size={14} /> {client.email}
                    </a>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)" }}>
                      <Mail size={14} /> No email
                    </div>
                  )}
                  {client.phone ? (
                    <a href={`tel:${client.phone}`} style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)" }}>
                      <Phone size={14} /> {client.phone}
                    </a>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)" }}>
                      <Phone size={14} /> No phone
                    </div>
                  )}
                </div>

                <div className="divider" style={{ margin: "4px 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{client._count?.invoices || 0}</span> Invoices
                  </div>
                  <Link href={`/invoices?clientId=${client.id}`} className="btn btn-secondary btn-sm" style={{ fontSize: "0.75rem", padding: "4px 8px" }}>
                    View History
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingClient(null); }}
        title={editingClient ? "Edit Client" : "Add Client"}
      >
        <ClientForm
          defaultValues={editingClient ? {
            name: editingClient.name,
            email: editingClient.email || undefined,
            phone: editingClient.phone || undefined,
            company: editingClient.company || undefined,
            address: editingClient.address || undefined,
            notes: editingClient.notes || undefined,
          } : undefined}
          onSubmit={handleSubmit}
          isLoading={actionLoading}
          submitLabel={editingClient ? "Save Changes" : "Create Client"}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
        confirmLabel="Delete Client"
        loading={actionLoading}
      />
    </>
  );
}
