"use client";
import { useEffect, useState } from "react";
import TopHeader from "@/components/layout/TopHeader";
import { 
  Users, FileText, Settings, Shield, Activity, Database, 
  TrendingUp, Server, HardDrive, Cpu, AlertCircle, CheckCircle2,
  ArrowUpRight, ArrowDownRight, MoreVertical
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 124,
    totalInvoices: 856,
    totalRevenue: 45200,
    activeSessions: 12,
    cpuUsage: 14,
    memoryUsage: 42,
    dbLatency: 24,
    systemStatus: "Operational"
  });

  const trafficData = [
    { time: "00:00", requests: 240 },
    { time: "04:00", requests: 120 },
    { time: "08:00", requests: 450 },
    { time: "12:00", requests: 890 },
    { time: "16:00", requests: 1200 },
    { time: "20:00", requests: 750 },
    { time: "23:59", requests: 380 },
  ];

  const subData = [
    { name: "Free", value: 65, color: "#94a3b8" },
    { name: "Pro", value: 42, color: "#6366f1" },
    { name: "Enterprise", value: 17, color: "#8b5cf6" },
  ];

  return (
    <>
      <TopHeader title="Admin Command Center" subtitle="Real-time platform monitoring & control" />
      
      <div className="page-container">
        {/* Top Tier Stats */}
        <div className="grid-4" style={{ marginBottom: "24px" }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
              <Users size={24} />
            </div>
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{stats.totalUsers}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: "var(--success)" }}>
              <ArrowUpRight size={14} /> +12% this month
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "var(--success-light)", color: "var(--success)" }}>
              <TrendingUp size={24} />
            </div>
            <div className="stat-label">Platform Revenue</div>
            <div className="stat-value">{formatCurrency(stats.totalRevenue, "GHS")}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: "var(--success)" }}>
              <ArrowUpRight size={14} /> +8.4% since last week
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "var(--warning-light)", color: "var(--warning)" }}>
              <Activity size={24} />
            </div>
            <div className="stat-label">Active Users</div>
            <div className="stat-value">{stats.activeSessions}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Current live sessions
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "var(--danger-light)", color: "var(--danger)" }}>
              <Server size={24} />
            </div>
            <div className="stat-label">System Health</div>
            <div className="stat-value" style={{ fontSize: "1.5rem", color: "var(--success)" }}>
              99.98%
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: "var(--success)" }}>
              <CheckCircle2 size={14} /> All systems nominal
            </div>
          </div>
        </div>

        <div className="grid-2-1" style={{ marginBottom: "24px" }}>
          {/* Main Traffic Chart */}
          <div className="card card-padding">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "4px" }}>Platform Traffic</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Requests per hour (Last 24h)</p>
              </div>
              <div style={{ padding: "8px 12px", background: "var(--bg-elevated)", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600 }}>
                Live Feed
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "var(--shadow-lg)" }}
                />
                <Area type="monotone" dataKey="requests" stroke="var(--accent)" strokeWidth={3} fill="url(#trafficGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* System Resources */}
          <div className="card card-padding" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "4px" }}>System Resources</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Cpu size={14} /> CPU Usage
                </span>
                <span style={{ fontWeight: 600 }}>{stats.cpuUsage}%</span>
              </div>
              <div style={{ height: "6px", background: "var(--bg-elevated)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${stats.cpuUsage}%`, height: "100%", background: "var(--accent)" }} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <HardDrive size={14} /> Memory Usage
                </span>
                <span style={{ fontWeight: 600 }}>{stats.memoryUsage}%</span>
              </div>
              <div style={{ height: "6px", background: "var(--bg-elevated)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${stats.memoryUsage}%`, height: "100%", background: "var(--success)" }} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Database size={14} /> DB Latency
                </span>
                <span style={{ fontWeight: 600 }}>{stats.dbLatency}ms</span>
              </div>
              <div style={{ height: "6px", background: "var(--bg-elevated)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: "35%", height: "100%", background: "var(--warning)" }} />
              </div>
            </div>

            <div className="divider"></div>

            <div style={{ padding: "16px", background: "var(--bg-elevated)", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "4px" }}>Database Cluster</div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>AWS-East-1 · Primary</div>
            </div>
          </div>
        </div>

        <div className="grid-2-1">
          {/* Subscriptions */}
          <div className="card">
            <div className="card-padding" style={{ borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.1rem" }}>Subscription Mix</h3>
              <button className="btn btn-ghost btn-icon"><MoreVertical size={18} /></button>
            </div>
            <div className="card-padding" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "24px", alignItems: "center" }}>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={subData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "var(--text-primary)", fontSize: 13 }} width={80} />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                    {subData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {subData.map(plan => (
                  <div key={plan.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: plan.color }} />
                      <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{plan.name}</span>
                    </div>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{plan.value} users</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="card">
            <div className="card-padding" style={{ borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: "1.1rem" }}>Critical Audit Logs</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { event: "Admin Login", user: "Admin", time: "2 mins ago", type: "info" },
                { event: "Database Backup", user: "System", time: "1 hour ago", type: "success" },
                { event: "Failed Login", user: "Unknown", time: "3 hours ago", type: "warning" },
                { event: "User Deleted", user: "Admin", time: "5 hours ago", type: "danger" },
              ].map((log, i) => (
                <div key={i} style={{ 
                  padding: "16px 20px", 
                  borderBottom: i === 3 ? "none" : "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px"
                }}>
                  <div style={{ 
                    width: "8px", height: "8px", borderRadius: "50%", 
                    background: log.type === "danger" ? "var(--danger)" : log.type === "warning" ? "var(--warning)" : "var(--accent)" 
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{log.event}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{log.user} · {log.time}</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" style={{ padding: "4px" }}>Details</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
