import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Providers from "@/components/Providers";
import { ToastContainer } from "@/components/ui/Toast";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  /*
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  */

  return (
    <div className="app-layout">
      <Sidebar isAdmin />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
