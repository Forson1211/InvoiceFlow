"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/Toast";
import { Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        toast("Invalid credentials", "error");
      } else {
        router.push("/dashboard");
      }
    } catch {
      toast("An error occurred", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
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
          <h1 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>Welcome back</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: "8px" }} disabled={isLoading}>
            {isLoading ? <span className="spinner" /> : "Sign In"}
          </button>
        </form>

        <div style={{ margin: "24px 0", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>

        <button type="button" className="btn btn-secondary btn-lg" style={{ width: "100%" }} onClick={handleGoogleSignIn}>
          <svg style={{ width: 18, height: 18, marginRight: 8 }} viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Don't have an account? <a href="/auth/register" style={{ fontWeight: 600 }}>Sign up</a>
        </p>
      </div>
    </div>
  );
}
