import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import Logo from "@/components/Logo";
import FloatingDecor from "@/components/FloatingDecor";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--cream)]">
      <FloatingDecor variant="dense" />
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/"><Logo /></Link>
        <Link to="/" className="text-sm font-semibold text-[var(--ink)] hover:text-[var(--orange-warm)]">← Retour à l'accueil</Link>
      </header>
      <main className="relative z-10 mx-auto flex max-w-6xl items-center justify-center px-6 pb-16">
        <Outlet />
      </main>
    </div>
  );
}
