import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendInvoiceEmail } from "@/lib/email";
import { InvoiceStatus } from "@prisma/client";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: session.user.id },
    include: { client: true, items: true },
  });

  if (!invoice) return NextResponse.json({ message: "Not found" }, { status: 404 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  // Update status to SENT
  const updated = await prisma.invoice.update({
    where: { id },
    data: { status: InvoiceStatus.SENT, sentAt: new Date() },
  });

  // Send email if client has one
  if (invoice.client?.email) {
    const viewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invoices/${id}/view`;
    try {
      await sendInvoiceEmail({
        to: invoice.client.email,
        clientName: invoice.client.name,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.total,
        currency: invoice.currency,
        dueDate: invoice.dueDate,
        viewUrl,
        fromName: user?.businessName || user?.name || "InvoiceGlow User",
      });
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
      // Don't fail the request if email fails
    }
  }

  return NextResponse.json({ invoice: updated, emailSent: !!invoice.client?.email });
}
