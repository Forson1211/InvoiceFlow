"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TopHeader from "@/components/layout/TopHeader";
import InvoiceForm from "@/components/forms/InvoiceForm";
import { api } from "@/lib/api";
import { useInvoiceStore } from "@/store";
import { toast } from "@/components/ui/Toast";

export default function NewInvoicePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { addInvoice } = useInvoiceStore();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res: any = await api.invoices.create(data);
      addInvoice(res.invoice);
      toast("Invoice created successfully!", "success");
      router.push(`/invoices/${res.invoice.id}`);
    } catch (err: any) {
      toast(err.message || "Failed to create invoice", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TopHeader title="New Invoice" subtitle="Create a new invoice" />
      <div className="page-container" style={{ maxWidth: "960px" }}>
        <InvoiceForm onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Create Invoice" />
      </div>
    </>
  );
}
