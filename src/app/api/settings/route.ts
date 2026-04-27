import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const settingsSchema = z.object({
  name: z.string().optional(),
  businessName: z.string().optional(),
  businessPhone: z.string().optional(),
  businessAddress: z.string().optional(),
  currency: z.string().optional(),
  taxRate: z.number().min(0).max(100).optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true, image: true,
      businessName: true, businessPhone: true,
      businessAddress: true, businessLogo: true,
      currency: true, taxRate: true,
    },
  });

  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = settingsSchema.parse(body);
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: {
        id: true, name: true, email: true,
        businessName: true, businessPhone: true,
        businessAddress: true, currency: true, taxRate: true,
      },
    });
    return NextResponse.json({ user });
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ message: "Invalid input", errors: err.issues }, { status: 400 });
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
