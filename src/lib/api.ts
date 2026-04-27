const API_BASE = "/api";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }
  return res.json();
}

// Auth
export const api = {
  auth: {
    register: (data: { name: string; email: string; password: string }) =>
      request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  },

  // Dashboard
  dashboard: {
    stats: () => request("/dashboard/stats"),
  },

  // Clients
  clients: {
    list: () => request("/clients"),
    get: (id: string) => request(`/clients/${id}`),
    create: (data: unknown) =>
      request("/clients", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: unknown) =>
      request(`/clients/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) =>
      request(`/clients/${id}`, { method: "DELETE" }),
  },

  // Invoices
  invoices: {
    list: (params?: { status?: string; clientId?: string }) => {
      const qs = params
        ? "?" + new URLSearchParams(params as Record<string, string>).toString()
        : "";
      return request(`/invoices${qs}`);
    },
    get: (id: string) => request(`/invoices/${id}`),
    create: (data: unknown) =>
      request("/invoices", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: unknown) =>
      request(`/invoices/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) =>
      request(`/invoices/${id}`, { method: "DELETE" }),
    send: (id: string) =>
      request(`/invoices/${id}/send`, { method: "POST" }),
    markPaid: (id: string) =>
      request(`/invoices/${id}/mark-paid`, { method: "POST" }),
    generatePdf: (id: string) =>
      request(`/invoices/${id}/pdf`, { method: "POST" }),
  },

  // Settings
  settings: {
    get: () => request("/settings"),
    update: (data: unknown) =>
      request("/settings", { method: "PATCH", body: JSON.stringify(data) }),
  },

  // Payments
  payments: {
    initiate: (invoiceId: string, data: unknown) =>
      request(`/payments/${invoiceId}/initiate`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    verify: (reference: string) =>
      request(`/payments/verify/${reference}`),
  },
};
