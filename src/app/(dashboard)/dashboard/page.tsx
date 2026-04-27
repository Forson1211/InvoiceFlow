"use client";
import { useEffect, useState } from "react";
import TopHeader from "@/components/layout/TopHeader";
import { api } from "@/lib/api";
import { useDashboardStore } from "@/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import type { DashboardStats } from "@/types";
import {
  DollarSign, Clock, CheckCircle, AlertTriangle, Users, FileText,
  TrendingUp, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const { stats, isLoading, setStats, setLoading } = useDashboardStore();

  useEffect(() => {
    setLoading(true);
    api.dashboard
      .stats()
      .then((data: any) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [setStats, setLoading]);

  if (isLoading && !stats) {
    return (
      <>
        <TopHeader title="Dashboard" subtitle="Welcome back!" />
        <div className="page-container">
          <div className="grid-4" style={{ marginBottom: "20px" }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="stat-card animate-pulse">
                <div style={{ height: "40px", background: "var(--bg-elevated)", borderRadius: "var(--radius)" }} />
                <div style={{ height: "32px", width: "60%", background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)" }} />
                <div style={{ height: "14px", width: "40%", background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)" }} />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  const statCards = [
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue ?? 0, "GHS"),
      icon: <DollarSign size={20} color="var(--success)" />,
      bg: "var(--success-light)",
      variant: "green",
    },
    {
      label: "Pending",
      value: formatCurrency(stats?.pendingAmount ?? 0, "GHS"),
      icon: <Clock size={20} color="var(--warning)" />,
      bg: "var(--warning-light)",
      variant: "amber",
    },
    {
      label: "Paid Invoices",
      value: (stats?.paidCount ?? 0).toString(),
      icon: <CheckCircle size={20} color="var(--accent)" />,
      bg: "var(--accent-light)",
      variant: "purple",
    },
    {
      label: "Overdue",
      value: (stats?.overdueCount ?? 0).toString(),
      icon: <AlertTriangle size={20} color="var(--danger)" />,
      bg: "var(--danger-light)",
      variant: "red",
    },
  ];

  return (
    <>
      <TopHeader title="Dashboard" subtitle="Here's what's happening with your business" />
      <div className="page-container">

        {/* Stat Cards */}
        <div className="grid-4" style={{ marginBottom: "24px" }}>
          {statCards.map((card) => (
            <div key={card.label} className={`stat-card ${card.variant}`}>
              <div className="stat-icon" style={{ background: card.bg }}>
                {card.icon}
              </div>
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Chart + Quick Stats */}
        <div className="grid-2-1" style={{ marginBottom: "24px" }}>
          {/* Revenue Chart */}
          <div className="card card-padding">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "1rem", marginBottom: "2px" }}>Revenue Overview</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Last 6 months</p>
              </div>
              <TrendingUp size={18} color="var(--accent)" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={stats?.monthlyRevenue ?? []}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={50}
                  tickFormatter={(v) => `₵${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`} />
                <Tooltip
                  contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--text-primary)" }}
                  formatter={(v: any) => [formatCurrency(Number(v) || 0, "GHS"), "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5}
                  fill="url(#revenueGrad)" dot={{ fill: "#6366f1", strokeWidth: 0, r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="card card-padding" style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div className="stat-icon" style={{ background: "var(--accent-light)", width: "32px", height: "32px" }}>
                  <FileText size={16} color="var(--accent)" />
                </div>
                <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>Invoices</span>
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>
                {stats?.totalInvoices ?? 0}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>Total created</div>
            </div>
            <div className="card card-padding" style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div className="stat-icon" style={{ background: "var(--success-light)", width: "32px", height: "32px" }}>
                  <Users size={16} color="var(--success)" />
                </div>
                <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>Clients</span>
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>
                {stats?.totalClients ?? 0}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>Active clients</div>
            </div>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "1rem" }}>Recent Invoices</h3>
            <Link href="/invoices" className="btn btn-ghost btn-sm" style={{ gap: "4px" }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="table-wrapper" style={{ borderRadius: 0, border: "none" }}>
            <table>
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {!stats?.recentInvoices?.length ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      No invoices yet — <Link href="/invoices/new">create your first one</Link>
                    </td>
                  </tr>
                ) : (
                  stats.recentInvoices.map((inv: any) => (
                    <tr key={inv.id}>
                      <td className="primary">
                        <Link href={`/invoices/${inv.id}`} style={{ color: "inherit" }}>
                          #{inv.invoiceNumber}
                        </Link>
                      </td>
                      <td>{inv.client?.name ?? <span style={{ color: "var(--text-muted)" }}>No client</span>}</td>
                      <td>{formatDate(inv.createdAt)}</td>
                      <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        {formatCurrency(inv.total, inv.currency)}
                      </td>
                      <td><StatusBadge status={inv.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
