import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InvoiceStatus, PaymentMethod, PaymentStatus } from "@prisma/client";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!invoice) return NextResponse.json({ message: "Not found" }, { status: 404 });

  await prisma.$transaction([
    prisma.invoice.update({
      where: { id },
      data: { status: InvoiceStatus.PAID, paidAt: new Date() },
    }),
    prisma.payment.create({
      data: {
        invoiceId: id,
        amount: invoice.total,
        currency: invoice.currency,
        method: PaymentMethod.CASH,
        status: PaymentStatus.COMPLETED,
        reference: `MANUAL-${Date.now()}`,
      },
    }),
  ]);

  return NextResponse.json({ message: "Invoice marked as paid" });
}
