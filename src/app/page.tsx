"use client";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { 
  Zap, 
  CheckCircle, 
  Smartphone, 
  FileText, 
  PieChart, 
  ArrowRight,
  Shield,
  CreditCard,
  Globe,
  Users,
  BarChart3,
  Cloud,
  MessageSquare,
  Layers,
  ChevronDown,
  Mail,
  Send,
  Star,
  Sun,
  Moon,
  Monitor
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUIStore } from "@/store";
import { useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";

export default function LandingPage() {
  const { theme, setTheme } = useUIStore();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isHero, setIsHero] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobileView = width < 1024;
  const isTouch = typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  // Scroll & Mouse Logic
  const { scrollYProgress } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const faqs = [
    { q: "Is InvoiceFlow free to use?", a: "Yes! We offer a generous free tier for freelancers just starting out. You can create up to 5 invoices per month for free." },
    { q: "Can I use my own branding?", a: "Absolutely. Our Pro and Enterprise plans allow you to add your logo, brand colors, and custom email signatures." },
    { q: "Do you support international payments?", a: "Yes, we integrate with Stripe and PayPal, allowing you to accept payments from over 135 currencies." },
    { q: "Is my data secure?", a: "We use bank-grade encryption and daily backups to ensure your financial data is always safe and accessible." },
  ];

  const testimonials = [
    { name: "Jane Doe", role: "Freelance Brand Designer", text: "InvoiceFlow has completely changed how I run my design business. I save hours every week on admin work.", initials: "JD" },
    { name: "Kojo Mensah", role: "Software Architect", text: "The MTN MoMo integration is a game-changer for my local clients in Ghana. Fast and reliable.", initials: "KM" },
    { name: "Sarah Smith", role: "Content Creator", text: "Beautiful templates that actually match my brand. My clients are always impressed by the invoices.", initials: "SS" },
    { name: "Alex Chen", role: "Photography Pro", text: "The dashboard gives me such a clear view of my monthly revenue. Best invoicing tool I've used.", initials: "AC" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", overflowX: "hidden" }}>
      {/* {!isTouch && (
        <>
          <motion.div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: isHero ? "white" : "rgba(99, 102, 241, 0.2)",
              border: isHero ? "1px solid white" : "1px solid var(--accent)",
              pointerEvents: "none",
              zIndex: 9999,
              x: cursorX,
              y: cursorY,
              backdropFilter: "blur(4px)",
            }}
          />
          <motion.div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: isHero ? "white" : "var(--accent)",
              pointerEvents: "none",
              zIndex: 9999,
              x: useSpring(mouseX, { damping: 40, stiffness: 400 }),
              y: useSpring(mouseY, { damping: 40, stiffness: 400 }),
              transform: "translate(12px, 12px)",
            }}
          />
        </>
      )} */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "var(--accent)",
          zIndex: 10000,
          scaleX: scrollYProgress,
          transformOrigin: "0%",
        }}
      />
      <nav style={{ 
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, 
        background: "color-mix(in srgb, var(--bg-primary) 85%, transparent)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)"
      }}>
        <div style={{ 
          maxWidth: "1200px", margin: "0 auto", padding: "16px 20px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          width: "100%"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 900, fontSize: "1.2rem", letterSpacing: "-0.5px" }}>
            <div className="brand-logo" style={{ width: "28px", height: "28px" }}>
              <Zap size={16} />
            </div>
            <span>InvoiceFlow</span>
          </div>
          {!isMobileView && (
            <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
              <Link href="#features" style={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.9rem" }}>Features</Link>
              <Link href="#pricing" style={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.9rem" }}>Pricing</Link>
              <Link href="#faq" style={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.9rem" }}>FAQ</Link>
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {!isMobileView && (
              <Link href="/auth/login" className="btn btn-ghost btn-sm">Sign In</Link>
            )}
            <Link href="/auth/register" className="btn btn-primary btn-sm">Get Started</Link>
            
            {isMobileView && (
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ 
                  color: "var(--text-primary)", background: "var(--bg-elevated)", border: "1px solid var(--border)", 
                  cursor: "pointer", width: "40px", height: "40px", borderRadius: "10px",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px",
                  position: "relative", zIndex: 1002
                }}
              >
                <div style={{ width: "20px", height: "2px", background: "currentColor", transition: "0.3s", transform: mobileMenuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
                <div style={{ width: "20px", height: "2px", background: "currentColor", transition: "0.3s", opacity: mobileMenuOpen ? 0 : 1 }} />
                <div style={{ width: "20px", height: "2px", background: "currentColor", transition: "0.3s", transform: mobileMenuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <motion.div
          initial={false}
          animate={{ opacity: mobileMenuOpen ? 1 : 0, y: mobileMenuOpen ? 0 : -20, pointerEvents: mobileMenuOpen ? "all" : "none" }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100vh",
            background: "color-mix(in srgb, var(--bg-primary) 98%, transparent)", 
            backdropFilter: "blur(32px)",
            padding: "120px 40px", display: "flex", flexDirection: "column", gap: "40px",
            zIndex: 1001, alignItems: "center", justifyContent: "center", textAlign: "center"
          }}
        >
          <Link href="#features" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>Features</Link>
          <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>Pricing</Link>
          <Link href="#faq" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>FAQ</Link>
          <div style={{ height: "1px", width: "60px", background: "var(--border)", margin: "8px 0" }} />
          <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>Sign In</Link>
          <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-lg" style={{ minWidth: "240px" }}>Get Started</Link>
          
          <div style={{ marginTop: "40px", width: "100%", maxWidth: "300px" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>Appearance</p>
            <div style={{ display: "flex", gap: "8px", background: "var(--bg-elevated)", padding: "6px", borderRadius: "16px", border: "1px solid var(--border)" }}>
              {(['light', 'dark', 'system'] as const).map(t => (
                <button 
                  key={t}
                  onClick={() => setTheme(t)}
                  style={{ 
                    flex: 1, height: "44px", borderRadius: "12px", 
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    background: theme === t ? "var(--accent)" : "transparent",
                    color: theme === t ? "white" : "var(--text-secondary)",
                    border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700,
                    transition: "all 0.2s"
                  }}
                >
                  {t === 'light' ? <Sun size={16} /> : t === 'dark' ? <Moon size={16} /> : <Monitor size={16} />}
                  <span style={{ textTransform: "capitalize" }}>{t}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </nav>

      <main>
        <section 
          onMouseEnter={() => setIsHero(true)}
          onMouseLeave={() => setIsHero(false)}
          style={{ 
            paddingTop: "clamp(80px, 10vh, 120px)", 
            paddingBottom: "clamp(40px, 8vh, 80px)", 
            textAlign: "center", 
            position: "relative", 
            overflow: "hidden",
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)",
            color: "#ffffff"
          }}
        >
          {/* Background Blobs with Mouse Parallax */}
          <motion.div style={{
            position: "absolute", top: "-10%", left: "-10%",
            width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
            zIndex: 0, pointerEvents: "none", filter: "blur(60px)",
            x: useTransform(mouseX, [0, 2000], [20, -20]),
            y: useTransform(mouseY, [0, 1000], [20, -20]),
          }} />
          <motion.div style={{
            position: "absolute", bottom: "-10%", right: "-10%",
            width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
            zIndex: 0, pointerEvents: "none", filter: "blur(80px)",
            x: useTransform(mouseX, [0, 2000], [-30, 30]),
            y: useTransform(mouseY, [0, 1000], [-30, 30]),
          }} />
          
          <div className="container" style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1, padding: "0 20px" }}>
            <h1 style={{ 
              fontSize: isMobileView ? "min(2.8rem, 13vw)" : "clamp(2rem, 8vw, 5rem)", 
              fontWeight: 800, 
              lineHeight: 1.1, 
              marginBottom: "24px",
              color: "#ffffff",
              letterSpacing: isMobileView ? "-0.06em" : "-0.04em",
              textShadow: "0 10px 30px rgba(0,0,0,0.1)",
              textTransform: "uppercase",
              WebkitTextStroke: "1px rgba(255,255,255,0.1)"
            }}>
              <span style={{ display: "block", fontWeight: 800 }}>What will you</span>
              <span style={{ display: "block", fontWeight: 800 }}>generate today?</span>
            </h1>
            
            <p style={{ 
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)", color: "rgba(255, 255, 255, 0.9)", marginBottom: "24px", lineHeight: 1.4, maxWidth: "650px", margin: "0 auto 24px"
            }}>
              InvoiceFlow makes it easy to create, manage, and track professional invoices. Spend less time on paperwork and more time doing what you love.
            </p>
            
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } }
              }}
              style={{ display: "flex", gap: "12px", justifyContent: "center", flexDirection: "column", alignItems: "center" }}
            >
              <motion.div variants={itemVariants} style={{ width: "100%", maxWidth: "340px" }}>
                <Link href="/auth/register" className="btn" style={{ 
                  height: "56px", fontSize: "1rem", borderRadius: "12px", 
                  background: "#ebf2ff", color: "#000", fontWeight: 700, border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", width: "100%"
                }}>
                  Start designing for free
                </Link>
              </motion.div>
              <motion.div variants={itemVariants} style={{ width: "100%", maxWidth: "340px" }}>
                <Link href="#features" className="btn" style={{ 
                  height: "56px", fontSize: "1rem", borderRadius: "12px", 
                  background: "#1e293b", color: "#ffffff", border: "none",
                  fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", width: "100%"
                }}>
                  Explore InvoiceFlow 2.0
                </Link>
              </motion.div>
            </motion.div>

            <div style={{ marginTop: isMobileView ? "32px" : "40px" }}>
              <p style={{ fontSize: isMobileView ? "0.75rem" : "0.9rem", color: "rgba(255, 255, 255, 0.7)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: isMobileView ? "20px" : "32px" }}>
                Trusted by 50,000+ freelancers worldwide
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: isMobileView ? "32px" : "60px", flexWrap: "wrap", opacity: 0.8, padding: "0 20px" }}>
                {["Airbnb", "Dropbox", "Slack", "Framer", "Notion"].map(brand => (
                  <div key={brand} style={{ fontSize: isMobileView ? "1.1rem" : "1.5rem", fontWeight: 800, color: "#ffffff", fontFamily: "serif" }}>{brand}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Large Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              marginTop: isMobileView ? "32px" : "48px", maxWidth: "1200px", margin: `${isMobileView ? '32px' : '48px'} auto 0`, position: "relative",
              padding: "0 20px"
            }}
          >
            <div style={{ 
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))", 
              borderRadius: "24px", padding: "12px", boxShadow: "0 40px 100px -20px rgba(0,0,0,0.5)"
            }}>
              <div style={{ 
                background: "var(--bg-elevated)", borderRadius: "16px", border: "1px solid var(--border)", 
                overflow: "hidden", position: "relative"
              }}>
                <div style={{ height: "48px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 20px", gap: "8px", background: "color-mix(in srgb, var(--bg-elevated) 80%, black)" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f" }} />
                  </div>
                  <div style={{ flex: 1, margin: "0 40px", height: "24px", background: "rgba(0,0,0,0.1)", borderRadius: "6px", display: "flex", alignItems: "center", padding: "0 12px", fontSize: "10px", color: "var(--text-muted)" }}>
                    app.invoiceflow.com/dashboard
                  </div>
                </div>
                <img src="/dashboard-mockup.png" alt="InvoiceFlow Dashboard Preview" style={{ width: "100%", height: "auto", display: "block" }} />
              </div>
            </div>
          </motion.div>
        </section>

        <motion.section 
          id="features" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          style={{ padding: "120px 20px", background: "var(--bg-secondary)" }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <motion.div variants={itemVariants} style={{ textAlign: "center", marginBottom: "80px" }}>
              <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, marginBottom: "20px", letterSpacing: "-0.02em" }}>
                Everything you need to <span style={{ color: "var(--accent)" }}>thrive</span>
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
                Powerful features that help you manage your business like a pro, without the steep learning curve.
              </p>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
              {[
                { icon: <FileText />, title: "Smart Templates", desc: "Choose from dozens of designer-made templates that you can customize to fit your brand.", color: "#6366f1" },
                { icon: <Globe />, title: "Global Payments", desc: "Accept payments from anywhere in the world with local payment methods support.", color: "#10b981" },
                { icon: <BarChart3 />, title: "Rich Analytics", desc: "Visualize your growth with detailed reports on revenue, expenses, and taxes.", color: "#f59e0b" },
                { icon: <Smartphone />, title: "On-the-go Mobile", desc: "Manage your entire business from your phone. Send invoices while you're commuting.", color: "#ec4899" },
                { icon: <Cloud />, title: "Auto Backups", desc: "Never lose a record. Your data is automatically backed up across multiple regions.", color: "#8b5cf6" },
                { icon: <Shield />, title: "Bank-Grade Security", desc: "Your data is encrypted with AES-256 at rest and TLS 1.3 in transit.", color: "#14b8a6" },
                { icon: <MessageSquare />, title: "Client Portal", desc: "Give your clients a dedicated space to view their history and make payments.", color: "#f43f5e" },
                { icon: <Layers />, title: "Third-party Integrations", desc: "Connect with your favorite tools like Slack, Notion, and Google Sheets.", color: "#3b82f6" },
              ].map((feature, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  style={{ 
                    padding: "40px", background: "var(--bg-primary)", border: "1px solid var(--border)", 
                    borderRadius: "24px", display: "flex", flexDirection: "column", gap: "20px",
                    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.transform = "translateY(-8px)"; 
                    e.currentTarget.style.borderColor = feature.color;
                    e.currentTarget.style.boxShadow = `0 20px 40px -10px ${feature.color}20`;
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.transform = "translateY(0)"; 
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "0 10px 30px -10px rgba(0,0,0,0.1)";
                  }}
                >
                  <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: `${feature.color}15`, color: feature.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "12px" }}>{feature.title}</h3>
                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Testimonial Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          style={{ padding: "120px 0", background: "var(--bg-primary)", overflow: "hidden" }}
        >
          <div style={{ textAlign: "center", marginBottom: "60px", padding: "0 20px" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "16px" }}>Trusted by creators worldwide</h2>
          </div>

          <div style={{ position: "relative", width: "100%" }}>
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              style={{ display: "flex", gap: "32px", width: "max-content", padding: "0 16px" }}
            >
              {[...testimonials, ...testimonials].map((t, i) => (
                <div key={i} style={{ 
                  width: isMobileView ? "300px" : "400px", background: "var(--bg-secondary)", borderRadius: "24px", padding: isMobileView ? "30px" : "40px",
                  border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "20px",
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)"
                }}>
                  <div style={{ display: "flex", gap: "4px", color: "#f59e0b" }}>
                    {[1,2,3,4,5].map(star => <Star key={star} fill="#f59e0b" size={16} />)}
                  </div>
                  <p style={{ color: "var(--text-primary)", fontSize: "1.05rem", fontWeight: 600, lineHeight: 1.5 }}>
                    "{t.text}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "auto" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.8rem", fontWeight: 800 }}>
                      {t.initials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>{t.name}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Pricing Section */}
        <motion.section 
          id="pricing" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          style={{ padding: "120px 20px", background: "var(--bg-secondary)" }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <motion.div variants={itemVariants} style={{ textAlign: "center", marginBottom: "80px" }}>
              <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, marginBottom: "20px" }}>Simple, transparent <span style={{ color: "var(--accent)" }}>pricing</span></h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem" }}>Choose the plan that's right for your business stage.</p>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>
              {[
                { name: "Starter", price: "$0", desc: "Perfect for new freelancers", features: ["Up to 5 invoices/mo", "Unlimited clients", "Basic templates", "MTN MoMo support"], highlight: false },
                { name: "Professional", price: "$12", desc: "For growing businesses", features: ["Unlimited invoices", "Custom branding", "Analytics dashboard", "PDF exports", "Priority email support"], highlight: true },
                { name: "Enterprise", price: "$49", desc: "For agencies and teams", features: ["Multi-user access", "API access", "White-label solution", "Dedicated account manager", "Custom contracts"], highlight: false },
              ].map((plan, i) => (
                <div key={i} style={{ 
                  padding: isMobileView ? "32px 24px" : "48px 40px", borderRadius: "32px", background: "var(--bg-primary)", border: plan.highlight ? `2px solid var(--accent)` : `1px solid var(--border)`,
                  position: "relative", display: "flex", flexDirection: "column",
                  transform: (plan.highlight && !isMobileView) ? "scale(1.05)" : "none",
                  zIndex: plan.highlight ? 10 : 1,
                  boxShadow: plan.highlight ? "0 20px 60px -10px rgba(99, 102, 241, 0.3)" : "none"
                }}>
                  {plan.highlight && (
                    <div style={{ position: "absolute", top: "20px", right: "20px", background: "var(--accent)", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 700 }}>Popular</div>
                  )}
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "8px" }}>{plan.name}</h3>
                  <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>{plan.desc}</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "40px" }}>
                    <span style={{ fontSize: "3rem", fontWeight: 900 }}>{plan.price}</span>
                    <span style={{ color: "var(--text-muted)" }}>/month</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", marginBottom: "48px" }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.95rem" }}>
                        <CheckCircle size={18} style={{ color: "var(--success)" }} /> {f}
                      </div>
                    ))}
                  </div>
                  <Link href="/auth/register" className={`btn ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`} style={{ width: "100%", height: "56px", borderRadius: "16px", fontSize: "1rem" }}>
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <section id="faq" style={{ padding: "120px 20px", background: "var(--bg-primary)" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <h2 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "16px" }}>Common Questions</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Everything you need to know about the product and billing.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "20px", overflow: "hidden", background: activeFaq === i ? "var(--bg-elevated)" : "transparent", transition: "all 0.3s ease" }}>
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    style={{ width: "100%", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "none", background: "none", color: "inherit", cursor: "pointer", textAlign: "left" }}
                  >
                    <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>{faq.q}</span>
                    <ChevronDown style={{ transform: activeFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.3s" }} />
                  </button>
                  <div style={{ height: activeFaq === i ? "auto" : 0, overflow: "hidden", transition: "height 0.3s" }}>
                    <div style={{ padding: "0 32px 24px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ padding: "120px 20px", textAlign: "center" }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ 
              maxWidth: "1000px", margin: "0 auto", padding: "100px 40px", borderRadius: "48px",
              background: "linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)",
              boxShadow: "0 40px 80px rgba(79, 70, 229, 0.4)",
              position: "relative", overflow: "hidden"
            }}
          >
            <div style={{ position: "absolute", top: "-50%", right: "-10%", width: "60%", height: "150%", background: "radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, transparent 70%)", transform: "rotate(30deg)" }} />
            <div style={{ position: "absolute", bottom: "-50%", left: "-10%", width: "40%", height: "150%", background: "radial-gradient(ellipse, rgba(255,255,255,0.1) 0%, transparent 70%)", transform: "rotate(-30deg)" }} />
            
            <h2 style={{ position: "relative", zIndex: 1, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, marginBottom: "28px", color: "#ffffff", letterSpacing: "-0.04em" }}>
              Start designing your success.
            </h2>
            <p style={{ position: "relative", zIndex: 1, fontSize: "1.3rem", color: "rgba(255,255,255,0.9)", marginBottom: "56px", maxWidth: "600px", margin: "0 auto 56px", lineHeight: 1.6 }}>
              Join over 50,000+ designers and freelancers who are getting paid faster with InvoiceFlow. No credit card required.
            </p>
            <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/auth/register" style={{ 
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                background: "#ffffff", color: "#4f46e5", padding: "0 48px", height: "72px", 
                fontSize: "1.2rem", fontWeight: 800, borderRadius: "36px", textDecoration: "none",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)", transition: "all 0.3s"
              }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 30px 60px rgba(0,0,0,0.3)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.2)"; }}>
                Create Your Account
              </Link>
              <Link href="/auth/login" style={{ 
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                background: "rgba(255,255,255,0.1)", color: "#ffffff", padding: "0 48px", height: "72px", 
                fontSize: "1.2rem", fontWeight: 800, borderRadius: "36px", textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)", transition: "all 0.3s"
              }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}>
                Sign In Instead
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: "var(--bg-primary)", borderTop: "1px solid var(--border)", paddingTop: "100px", paddingBottom: "60px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: isMobileView ? "1fr" : "1.5fr 4fr", 
            gap: isMobileView ? "60px" : "80px", 
            marginBottom: "80px" 
          }}>
            {/* Sidebar Column */}
            <div style={{ maxWidth: "400px", display: "flex", flexDirection: "column", gap: "40px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 900, fontSize: "1.6rem", letterSpacing: "-0.5px", marginBottom: "24px" }}>
                  <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, var(--accent), #8b5cf6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                    <Zap size={24} />
                  </div>
                  <span style={{ color: "var(--text-primary)" }}>
                    InvoiceFlow
                  </span>
                </div>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "32px", fontSize: "1rem" }}>
                  InvoiceFlow is the world's most versatile invoicing platform for freelancers and small businesses. We help you look professional and get paid faster.
                </p>
                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border)"; }}>X</div>
                  <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border)"; }}>in</div>
                  <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border)"; }}>ig</div>
                </div>
              </div>

              <div>
                <h4 style={{ color: "var(--text-primary)", fontWeight: 700, marginBottom: "28px", fontSize: "1.1rem" }}>Stay in the loop</h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "24px", lineHeight: 1.6 }}>Join our newsletter to get latest product updates and tips for freelancers.</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <Mail style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", width: "20px" }} />
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      style={{ width: "100%", height: "56px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "16px", padding: "0 16px 0 48px", color: "var(--text-primary)", outline: "none" }} 
                    />
                  </div>
                  <button style={{ width: "56px", height: "56px", background: "var(--accent)", color: "white", border: "none", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 10px 20px var(--accent-glow)" }}>
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Links Group Column */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: isMobileView ? "repeat(2, 1fr)" : "repeat(4, 1fr)", 
              gap: "40px"
            }}>
              <div>
                <h4 style={{ color: "var(--text-primary)", fontWeight: 700, marginBottom: "20px", fontSize: "1.1rem" }}>Product</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <Link href="#features" className="footer-link">Features</Link>
                  <Link href="#pricing" className="footer-link">Pricing</Link>
                  <Link href="#" className="footer-link">Templates</Link>
                  <Link href="#" className="footer-link">Integrations</Link>
                  <Link href="#" className="footer-link">Updates</Link>
                </div>
              </div>

              <div>
                <h4 style={{ color: "var(--text-primary)", fontWeight: 700, marginBottom: "20px", fontSize: "1.1rem" }}>Resources</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <Link href="#faq" className="footer-link">Help Center</Link>
                  <Link href="#" className="footer-link">Documentation</Link>
                  <Link href="#" className="footer-link">API Reference</Link>
                  <Link href="#" className="footer-link">Community</Link>
                  <Link href="#" className="footer-link">Blog</Link>
                </div>
              </div>

              <div>
                <h4 style={{ color: "var(--text-primary)", fontWeight: 700, marginBottom: "20px", fontSize: "1.1rem" }}>Solutions</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <Link href="#" className="footer-link">For Freelancers</Link>
                  <Link href="#" className="footer-link">For Agencies</Link>
                  <Link href="#" className="footer-link">Small Business</Link>
                  <Link href="#" className="footer-link">Enterprise</Link>
                  <Link href="#" className="footer-link">Global Tax</Link>
                </div>
              </div>

              <div>
                <h4 style={{ color: "var(--text-primary)", fontWeight: 700, marginBottom: "20px", fontSize: "1.1rem" }}>Company</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <Link href="#" className="footer-link">About Us</Link>
                  <Link href="#" className="footer-link">Careers</Link>
                  <Link href="#" className="footer-link">Press</Link>
                  <Link href="#" className="footer-link">Contact</Link>
                  <Link href="#" className="footer-link">Partners</Link>
                </div>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: "40px", borderTop: "1px solid var(--border)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "24px" }}>
            <div style={{ display: "flex", gap: "24px", order: 2 }} className="md:order-1">
              <Link href="#" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.85rem" }}>Privacy Policy</Link>
              <Link href="#" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.85rem" }}>Terms of Service</Link>
              <Link href="#" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.85rem" }}>Cookie Settings</Link>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", order: 1 }} className="md:order-2">
              &copy; {new Date().getFullYear()} InvoiceFlow Inc. All rights reserved.
            </p>

            <div style={{ position: "relative", order: 3 }}>
              <button 
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                style={{ 
                  background: "var(--bg-elevated)", border: "1px solid var(--border)", 
                  borderRadius: "10px", width: "40px", height: "40px", 
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  color: "var(--text-secondary)", transition: "all 0.2s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              >
                {theme === 'light' ? <Sun size={18} /> : theme === 'dark' ? <Moon size={18} /> : <Monitor size={18} />}
              </button>
              
              {themeMenuOpen && (
                <>
                  <div 
                    onClick={() => setThemeMenuOpen(false)}
                    style={{ position: "fixed", inset: 0, zIndex: 999 }}
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    style={{ 
                      position: "absolute", bottom: "50px", right: 0, 
                      background: "var(--bg-card)", border: "1px solid var(--border)", 
                      borderRadius: "14px", padding: "6px", width: "150px",
                      boxShadow: "var(--shadow-lg)", zIndex: 1000,
                      backdropFilter: "blur(12px)"
                    }}
                  >
                    {(['light', 'dark', 'system'] as const).map(t => (
                      <button 
                        key={t}
                        onClick={() => { setTheme(t); setThemeMenuOpen(false); }}
                        style={{ 
                          width: "100%", padding: "10px 12px", borderRadius: "10px", 
                          display: "flex", alignItems: "center", gap: "10px",
                          background: theme === t ? "var(--accent-light)" : "transparent",
                          border: "none", cursor: "pointer", color: theme === t ? "var(--accent)" : "var(--text-secondary)",
                          fontSize: "0.85rem", fontWeight: theme === t ? 700 : 500,
                          textAlign: "left", transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => { if (theme !== t) e.currentTarget.style.background = "var(--bg-card-hover)"; }}
                        onMouseLeave={(e) => { if (theme !== t) e.currentTarget.style.background = "transparent"; }}
                      >
                        <div style={{ 
                          width: "24px", height: "24px", borderRadius: "6px", 
                          background: theme === t ? "var(--accent)" : "transparent",
                          color: theme === t ? "white" : "inherit",
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          {t === 'light' ? <Sun size={14} /> : t === 'dark' ? <Moon size={14} /> : <Monitor size={14} />}
                        </div>
                        <span style={{ textTransform: "capitalize" }}>{t}</span>
                        {theme === t && (
                          <div style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)" }} />
                        )}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

