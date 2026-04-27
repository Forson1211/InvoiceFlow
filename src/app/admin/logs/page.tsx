"use client";
import { useState } from "react";
import TopHeader from "@/components/layout/TopHeader";
import { 
  Activity, Search, Filter, Download, 
  AlertCircle, Info, CheckCircle2, Clock, Terminal
} from "lucide-react";

export default function AuditLogs() {
  const [filter, setFilter] = useState("ALL");

  const logs = [
    { id: 1, event: "User Login", user: "john@example.com", ip: "192.168.1.1", time: "2023-10-25 14:20:12", type: "INFO" },
    { id: 2, event: "Invoice Created", user: "sarah@design.co", ip: "10.0.0.42", time: "2023-10-25 14:15:05", type: "SUCCESS" },
    { id: 3, event: "Settings Updated", user: "admin@invoiceglow.app", ip: "85.214.12.9", time: "2023-10-25 13:45:30", type: "WARNING" },
    { id: 4, event: "Failed Login Attempt", user: "unknown", ip: "45.12.33.201", time: "2023-10-25 13:10:44", type: "DANGER" },
    { id: 5, event: "Database Backup", user: "System", ip: "localhost", time: "2023-10-25 12:00:00", type: "SUCCESS" },
    { id: 6, event: "API Key Generated", user: "alex@photo.pro", ip: "172.16.0.5", time: "2023-10-25 11:30:15", type: "INFO" },
  ];

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'SUCCESS': return 'var(--success)';
      case 'WARNING': return 'var(--warning)';
      case 'DANGER': return 'var(--danger)';
      default: return 'var(--accent)';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'SUCCESS': return <CheckCircle2 size={16} />;
      case 'WARNING': return <AlertCircle size={16} />;
      case 'DANGER': return <AlertCircle size={16} />;
      default: return <Info size={16} />;
    }
  };

  return (
    <>
      <TopHeader title="System Audit Logs" subtitle="Track every action across the platform" />
      
      <div className="page-container">
        {/* Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", gap: "16px" }}>
          <div style={{ display: "flex", gap: "12px", flex: 1 }}>
            <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
              <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} size={18} />
              <input 
                type="text" 
                placeholder="Search logs..." 
                className="form-input" 
                style={{ paddingLeft: "40px" }}
              />
            </div>
            <select 
              className="form-select" 
              style={{ maxWidth: "150px" }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">All Events</option>
              <option value="INFO">Info</option>
              <option value="SUCCESS">Success</option>
              <option value="WARNING">Warning</option>
              <option value="DANGER">Danger</option>
            </select>
          </div>
          
          <button className="btn btn-secondary">
            <Download size={18} />
            Export Logs
          </button>
        </div>

        {/* Logs Table */}
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Actor</th>
                  <th>IP Address</th>
                  <th>Timestamp</th>
                  <th>Level</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="primary">
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Terminal size={14} color="var(--text-muted)" />
                        {log.event}
                      </div>
                    </td>
                    <td>{log.user}</td>
                    <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{log.ip}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        <Clock size={14} />
                        {log.time}
                      </div>
                    </td>
                    <td>
                      <div style={{ 
                        display: "flex", alignItems: "center", gap: "6px", 
                        color: getTypeColor(log.type), fontWeight: 700, fontSize: "0.75rem"
                      }}>
                        {getTypeIcon(log.type)}
                        {log.type}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Stream Placeholder */}
        <div style={{ marginTop: "24px", padding: "20px", background: "#000", borderRadius: "12px", border: "1px solid #333", color: "#00ff00", fontFamily: "monospace", fontSize: "0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", color: "#fff" }}>
            <Activity size={16} /> Live System Stream
          </div>
          <div>[2023-10-25 14:25:01] INFO: Request GET /api/dashboard successful (200 OK)</div>
          <div>[2023-10-25 14:25:03] DEBUG: Cache hit for key "user_stats_124"</div>
          <div>[2023-10-25 14:25:05] INFO: Request POST /api/invoices processing...</div>
          <div style={{ opacity: 0.5 }}>[2023-10-25 14:25:08] WAITING FOR EVENTS...</div>
        </div>
      </div>
    </>
  );
}
