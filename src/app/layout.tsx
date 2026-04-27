import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: "InvoiceFlow — Professional Invoicing for Freelancers",
  description:
    "Create, send and get paid faster with InvoiceFlow. Mobile money payments, PDF invoices, and client management built for Ghana and emerging markets.",
  keywords: "invoice, invoicing, mobile money, Ghana, MTN MoMo, freelancer, small business",
  openGraph: {
    title: "InvoiceFlow",
    description: "Professional invoicing with mobile money payments",
    type: "website",
  },
};

import Providers from "@/components/Providers";
import { ToastContainer } from "@/components/ui/Toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={jakarta.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0f1e" />
      </head>
      <body style={{ fontFamily: "var(--font-jakarta), sans-serif" }}>
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
