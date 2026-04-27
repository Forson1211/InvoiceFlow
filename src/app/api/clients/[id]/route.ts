import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const clientSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
});

async function getClient(id: string, userId: string) {
  return prisma.client.findFirst({ where: { id, userId } });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const client = await prisma.client.findFirst({
    where: { id, userId: session.user.id },
    include: {
      invoices: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
    },
  });
  if (!client) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ client });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = await getClient(id, session.user.id);
  if (!existing) return NextResponse.json({ message: "Not found" }, { status: 404 });

  try {
    const body = await req.json();
    const data = clientSchema.parse(body);
    const client = await prisma.client.update({ where: { id }, data });
    return NextResponse.json({ client });
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ message: "Invalid input", errors: err.issues }, { status: 400 });
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = await getClient(id, session.user.id);
  if (!existing) return NextResponse.json({ message: "Not found" }, { status: 404 });
  await prisma.client.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
