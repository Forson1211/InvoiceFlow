import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generateInvoiceNumber } from "@/lib/utils";
import { InvoiceStatus } from "@prisma/client";

const itemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().min(0),
});

const invoiceSchema = z.object({
  clientId: z.string().optional(),
  dueDate: z.string(),
  currency: z.string().default("GHS"),
  taxRate: z.number().min(0).max(100).default(0),
  discount: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
  terms: z.string().optional(),
  items: z.array(itemSchema).min(1),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as InvoiceStatus | null;
  const clientId = searchParams.get("clientId");

  const invoices = await prisma.invoice.findMany({
    where: {
      userId: session.user.id,
      ...(status && { status }),
      ...(clientId && { clientId }),
    },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { id: true, name: true, email: true } },
      items: true,
      _count: { select: { payments: true } },
    },
  });

  return NextResponse.json({ invoices });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = invoiceSchema.parse(body);

    // Calculate totals
    const subtotal = data.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const discountAmt = (subtotal * data.discount) / 100;
    const taxable = subtotal - discountAmt;
    const taxAmount = (taxable * data.taxRate) / 100;
    const total = taxable + taxAmount;

    const invoice = await prisma.invoice.create({
      data: {
        userId: session.user.id,
        clientId: data.clientId || null,
        invoiceNumber: generateInvoiceNumber(),
        dueDate: new Date(data.dueDate),
        currency: data.currency,
        taxRate: data.taxRate,
        discount: data.discount,
        subtotal,
        taxAmount,
        total,
        notes: data.notes,
        terms: data.terms,
        status: InvoiceStatus.DRAFT,
        items: {
          create: data.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.quantity * item.unitPrice,
          })),
        },
      },
      include: { client: true, items: true },
    });

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ message: "Invalid input", errors: err.issues }, { status: 400 });
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
