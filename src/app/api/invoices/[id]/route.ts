import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { InvoiceStatus } from "@prisma/client";

async function getInvoice(id: string, userId: string) {
  return prisma.invoice.findFirst({
    where: { id, userId },
    include: { client: true, items: true, payments: true },
  });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const invoice = await getInvoice(id, session.user.id);
  if (!invoice) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ invoice });
}

const updateSchema = z.object({
  status: z.nativeEnum(InvoiceStatus).optional(),
  clientId: z.string().optional().nullable(),
  dueDate: z.string().optional(),
  currency: z.string().optional(),
  taxRate: z.number().min(0).max(100).optional(),
  discount: z.number().min(0).max(100).optional(),
  notes: z.string().optional().nullable(),
  terms: z.string().optional().nullable(),
  items: z
    .array(
      z.object({
        description: z.string().min(1),
        quantity: z.number().positive(),
        unitPrice: z.number().min(0),
      })
    )
    .optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = await getInvoice(id, session.user.id);
  if (!existing) return NextResponse.json({ message: "Not found" }, { status: 404 });

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);

    let totals = {};
    if (data.items) {
      const subtotal = data.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
      const taxRate = data.taxRate ?? existing.taxRate;
      const discount = data.discount ?? existing.discount;
      const discountAmt = (subtotal * discount) / 100;
      const taxable = subtotal - discountAmt;
      const taxAmount = (taxable * taxRate) / 100;
      const total = taxable + taxAmount;
      totals = { subtotal, taxAmount, total };
    }

    const invoice = await prisma.$transaction(async (tx) => {
      if (data.items) {
        await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
        await tx.invoiceItem.createMany({
          data: data.items.map((item) => ({
            invoiceId: id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.quantity * item.unitPrice,
          })),
        });
      }
      return tx.invoice.update({
        where: { id },
        data: {
          ...(data.status && { status: data.status }),
          ...(data.clientId !== undefined && { clientId: data.clientId }),
          ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
          ...(data.currency && { currency: data.currency }),
          ...(data.taxRate !== undefined && { taxRate: data.taxRate }),
          ...(data.discount !== undefined && { discount: data.discount }),
          ...(data.notes !== undefined && { notes: data.notes }),
          ...(data.terms !== undefined && { terms: data.terms }),
          ...totals,
        },
        include: { client: true, items: true, payments: true },
      });
    });

    return NextResponse.json({ invoice });
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ message: "Invalid input", errors: err.issues }, { status: 400 });
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = await getInvoice(id, session.user.id);
  if (!existing) return NextResponse.json({ message: "Not found" }, { status: 404 });
  await prisma.invoice.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
