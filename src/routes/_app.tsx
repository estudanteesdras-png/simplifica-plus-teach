import { Link, Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bell,
  BookOpen,
  Clock,
  Heart,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  NotebookPen,
  Sparkles,
  Sun,
  BarChart3,
  User,
  Wand2,
  X,
} from "lucide-react";

import { Logo } from "@/components/Logo";
import { OnboardingProfessor } from "@/components/OnboardingProfessor";
import { Button } from "@/components/ui/button";
import { ADMIN_EMAIL, useApp } from "@/lib/store";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const NAV = [
  { to: "/painel", label: "Painel", icon: LayoutDashboard },
  { to: "/sequencias", label: "Sequência didática", icon: Layers },
  { to: "/planos", label: "Planos de aula", icon: NotebookPen },
  { to: "/atividades", label: "Criar atividades", icon: Wand2 },
  { to: "/biblioteca", label: "Biblioteca", icon: BookOpen },
  { to: "/ia", label: "IA educacional", icon: Sparkles },
  { to: "/historico", label: "Histórico", icon: Clock },
  { to: "/favoritos", label: "Favoritos", icon: Heart },
  { to: "/perfil", label: "Perfil", icon: User },
  { to: "/kpis", label: "Painel de KPIs", icon: BarChart3, admin: true },
] as const;

function AppLayout() {
  const { user, hydrated, logout, theme, toggleTheme, notificacoes } = useApp();
  const ehAdmin = user?.email?.trim().toLowerCase() === ADMIN_EMAIL;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (hydrated && !user) navigate({ to: "/login" });
  }, [hydrated, user, navigate]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  if (!hydrated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Carregando…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {!user.onboardingOk && <OnboardingProfessor />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-card p-4 transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link to="/painel">
            <Logo />
          </Link>
          <button
            className="rounded-lg p-2 text-muted-foreground lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-6 space-y-1">
          {NAV.filter((item) => !("admin" in item) || ehAdmin).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-brand data-[status=active]:text-primary-foreground data-[status=active]:shadow-glow"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-soft p-4">
          <p className="text-sm font-semibold">{user.nome}</p>
          <p className="truncate text-xs text-muted-foreground">{user.escola}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full justify-start gap-2 px-2"
            onClick={() => {
              void logout().then(() => navigate({ to: "/" }));
            }}
          >
            <LogOut size={16} /> Sair
          </Button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-navy/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur">
          <div className="flex min-w-0 items-center gap-2">
            <button
              className="rounded-lg p-2 text-muted-foreground lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>
            <span className="truncate text-sm font-semibold text-muted-foreground lg:hidden">
              Simplifica+ Tech
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Alternar tema">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Link
              to="/notificacoes"
              aria-label="Notificações"
              className="relative rounded-lg p-2 hover:bg-secondary"
            >
              <Bell size={18} />
              {naoLidas > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand-purple px-1 text-[10px] font-bold text-primary-foreground">
                  {naoLidas}
                </span>
              )}
            </Link>
          </div>
        </header>

        <main key={pathname} className="animar-entrada mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}