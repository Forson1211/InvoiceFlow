"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/Toast";
import { Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.auth.register({ name, email, password });
      toast("Account created! Please sign in.", "success");
      router.push("/auth/login");
    } catch (err: any) {
      toast(err.message || "Failed to create account", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)", padding: "20px", position: "relative" }}>
      <Link href="/" style={{ 
        position: "absolute", top: "24px", left: "24px", 
        display: "flex", alignItems: "center", gap: "8px", 
        color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500,
        padding: "8px 16px", borderRadius: "12px", background: "var(--bg-elevated)", border: "1px solid var(--border)",
        transition: "all 0.2s"
      }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>
        <ArrowLeft size={18} /> Back to Home
      </Link>
      <div className="card" style={{ width: "100%", maxWidth: "420px", padding: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div className="brand-logo" style={{ margin: "0 auto 16px", width: "48px", height: "48px" }}>
            <Zap size={24} />
          </div>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>Create an account</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Start managing your invoices today</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" required value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: "8px" }} disabled={isLoading}>
            {isLoading ? <span className="spinner" /> : "Sign Up"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Already have an account? <a href="/auth/login" style={{ fontWeight: 600 }}>Sign in</a>
        </p>
      </div>
    </div>
  );
}
