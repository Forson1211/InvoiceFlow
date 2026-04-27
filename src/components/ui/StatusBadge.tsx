"use client";
import { getStatusColor, getStatusLabel } from "@/lib/utils";
import type { InvoiceStatus } from "@/types";

interface StatusBadgeProps {
  status: InvoiceStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const classMap: Record<string, string> = {
    DRAFT: "badge badge-draft",
    SENT: "badge badge-sent",
    PAID: "badge badge-paid",
    OVERDUE: "badge badge-overdue",
    CANCELLED: "badge badge-cancelled",
  };
  return (
    <span className={classMap[status] || "badge"}>
      <span className="badge-dot" style={{ background: "currentColor" }} />
      {getStatusLabel(status)}
    </span>
  );
}
