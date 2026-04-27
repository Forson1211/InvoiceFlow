import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InvoiceStatus } from "@prisma/client";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // Get current and previous month dates
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      invoiceStats, 
      clientCount, 
      recentInvoices, 
      lastMonthRevenue,
      lastMonthClientCount
    ] = await Promise.all([
      // Aggregated invoice totals by status
      prisma.invoice.groupBy({
        by: ['status'],
        where: { userId },
        _sum: { total: true },
        _count: { id: true },
      }),
      // Total client count
      prisma.client.count({ where: { userId } }),
      // Recent invoices
      prisma.invoice.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { client: { select: { name: true } } },
      }),
      // Last month's revenue for growth calculation
      prisma.invoice.aggregate({
        where: { 
          userId, 
          status: InvoiceStatus.PAID,
          createdAt: {
            gte: firstDayLastMonth,
            lt: firstDayCurrentMonth
          }
        },
        _sum: { total: true }
      }),
      // Last month's client count for growth calculation
      prisma.client.count({
        where: {
          userId,
          createdAt: {
            lt: firstDayCurrentMonth
          }
        }
      })
    ]);

    // Process grouped stats
    const statsMap = invoiceStats.reduce((acc, curr) => {
      acc[curr.status] = {
        total: curr._sum.total || 0,
        count: curr._count.id || 0
      };
      return acc;
    }, {} as Record<string, { total: number, count: number }>);

    const totalRevenue = statsMap[InvoiceStatus.PAID]?.total || 0;
    const pendingAmount = statsMap[InvoiceStatus.SENT]?.total || 0;
    const overdueCount = statsMap[InvoiceStatus.OVERDUE]?.count || 0;
    const paidCount = statsMap[InvoiceStatus.PAID]?.count || 0;
    const totalInvoices = invoiceStats.reduce((sum, curr) => sum + curr._count.id, 0);

    // Calculate growth percentages
    const prevRevenue = lastMonthRevenue._sum.total || 0;
    const revenueGrowth = prevRevenue === 0 ? 100 : Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100);
    
    const prevClientCount = lastMonthClientCount || 0;
    const clientGrowth = prevClientCount === 0 ? 100 : Math.round(((clientCount - prevClientCount) / prevClientCount) * 100);

    // Monthly revenue for chart (last 6 months) - Optimization: fetch only needed invoices
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const chartInvoices = await prisma.invoice.findMany({
      where: {
        userId,
        status: InvoiceStatus.PAID,
        createdAt: { gte: sixMonthsAgo }
      },
      select: { total: true, createdAt: true }
    });

    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const month = d.toLocaleString("en", { month: "short" });
      const revenue = chartInvoices
        .filter((inv) => {
          const created = new Date(inv.createdAt);
          return created.getFullYear() === d.getFullYear() && created.getMonth() === d.getMonth();
        })
        .reduce((sum, inv) => sum + inv.total, 0);
      return { month, revenue };
    });

    return NextResponse.json({
      totalRevenue,
      pendingAmount,
      overdueCount,
      paidCount,
      totalInvoices,
      totalClients: clientCount,
      recentInvoices,
      monthlyRevenue,
      growth: {
        revenue: revenueGrowth,
        clients: clientGrowth
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
