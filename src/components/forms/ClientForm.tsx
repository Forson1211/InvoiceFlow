"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Client } from "@/types";

const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof clientSchema>;

interface ClientFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: FormValues) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export default function ClientForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Save Client",
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div className="grid-2" style={{ gap: "14px" }}>
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input className="form-input" placeholder="John Mensah" {...register("name")} />
          {errors.name && <span className="form-error">{errors.name.message}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Company</label>
          <input className="form-input" placeholder="Mensah & Co." {...register("company")} />
        </div>
      </div>

      <div className="grid-2" style={{ gap: "14px" }}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" className="form-input" placeholder="john@example.com" {...register("email")} />
          {errors.email && <span className="form-error">{errors.email.message}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-input" placeholder="+233 24 000 0000" {...register("phone")} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Address</label>
        <input className="form-input" placeholder="123 Ring Road, Accra, Ghana" {...register("address")} />
      </div>

      <div className="form-group">
        <label className="form-label">Notes</label>
        <textarea className="form-textarea" placeholder="Internal notes about this client..." rows={3} {...register("notes")} />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "4px" }}>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? <span className="spinner" /> : submitLabel}
        </button>
      </div>
    </form>
  );
}
