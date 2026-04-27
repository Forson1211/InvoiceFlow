export function LoadingSpinner({ size = "default" }: { size?: "default" | "lg" }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "48px" }}>
      <div className={size === "lg" ? "spinner spinner-lg" : "spinner"} />
    </div>
  );
}

export function LoadingRow() {
  return (
    <tr>
      <td colSpan={100} style={{ textAlign: "center", padding: "48px" }}>
        <div className="spinner" style={{ margin: "0 auto" }} />
      </td>
    </tr>
  );
}

export function SkeletonCard() {
  return (
    <div className="card card-padding" style={{ gap: "12px", display: "flex", flexDirection: "column" }}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse"
          style={{
            height: i === 0 ? "24px" : "16px",
            width: i === 2 ? "60%" : "100%",
            background: "var(--bg-elevated)",
            borderRadius: "var(--radius-sm)",
          }}
        />
      ))}
    </div>
  );
}
