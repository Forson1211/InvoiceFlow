import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentStatus, InvoiceStatus } from "@prisma/client";
import crypto from "crypto";

// Paystack webhook handler
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";

  // Verify webhook signature
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const { reference, metadata } = event.data;
    const invoiceId = metadata?.invoiceId;

    if (!invoiceId) return NextResponse.json({ received: true });

    const payment = await prisma.payment.findUnique({ where: { reference } });

    if (!payment) {
      await prisma.payment.create({
        data: {
          invoiceId,
          amount: event.data.amount / 100, // Paystack sends in kobo/pesewas
          currency: event.data.currency,
          reference,
          status: PaymentStatus.COMPLETED,
          provider: event.data.channel,
          metadata: event.data,
        },
      });
    } else {
      await prisma.payment.update({
        where: { reference },
        data: { status: PaymentStatus.COMPLETED },
      });
    }

    // Mark invoice as paid
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: InvoiceStatus.PAID, paidAt: new Date() },
    });
  }

  return NextResponse.json({ received: true });
}
