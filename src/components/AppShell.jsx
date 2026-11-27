export function AppShell({ children }) {
  return (
    <div
      className="min-h-screen bg-slate-950 text-white select-none"
      style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 0.75rem)",
        paddingRight: "calc(env(safe-area-inset-right, 0px) + 0.75rem)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)",
        paddingLeft: "calc(env(safe-area-inset-left, 0px) + 0.75rem)",
      }}
    >
      <div className="max-w-xl mx-auto">{children}</div>
    </div>
  );
}
