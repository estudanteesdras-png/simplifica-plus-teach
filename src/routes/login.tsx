import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Logo } from "@/components/Logo";
import { Cerebro } from "@/components/mascotes/Cerebros";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/store";

type Search = { modo?: "cadastro" | "login" };

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    modo: search.modo === "cadastro" ? "cadastro" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Entrar — Simplifica+ Tech" },
      {
        name: "description",
        content: "Acesse sua conta do Simplifica+ Tech e continue seus planejamentos.",
      },
      { property: "og:title", content: "Entrar — Simplifica+ Tech" },
      { property: "og:description", content: "Acesse a plataforma do professor." },
      { property: "og:url", content: "https://simplificatechbr.com.br/login" },
    ],
    links: [{ rel: "canonical", href: "https://simplificatechbr.com.br/login" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { modo } = Route.useSearch();
  const cadastro = modo === "cadastro";
  const { entrar, cadastrar, user, hydrated } = useApp();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (hydrated && user) navigate({ to: "/painel" });
  }, [hydrated, user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || senha.length < 6) {
      toast.error("Informe um e-mail e uma senha com pelo menos 6 caracteres.");
      return;
    }
    setCarregando(true);
    const r = cadastro ? await cadastrar(nome, email, senha) : await entrar(email, senha);
    setCarregando(false);
    if (r.erro) {
      toast.error(
        r.erro.includes("Invalid login")
          ? "E-mail ou senha incorretos."
          : r.erro.includes("already registered")
            ? "Este e-mail já tem conta. Faça login."
            : r.erro,
      );
      return;
    }
    if (cadastro) {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.success("Conta criada! Confirme o e-mail que enviamos para entrar.");
        return;
      }
    }
    toast.success(cadastro ? "Conta criada com sucesso!" : "Bem-vindo(a) de volta!");
    navigate({ to: "/painel" });
  }

  async function entrarComGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Não foi possível entrar com o Google.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/painel" });
  }

  async function recuperarSenha() {
    if (!email.trim()) {
      toast.error("Digite seu e-mail para receber o link.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    toast[error ? "error" : "info"](
      error ? error.message : "Enviamos um link de redefinição para o e-mail informado.",
    );
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-brand p-10 text-primary-foreground lg:flex">
        <Link to="/" className="text-lg font-extrabold">
          Simplifica+ Tech
        </Link>
        <div>
          <div className="mb-6 flex gap-3">
            <Cerebro variante="educador" size={64} />
            <Cerebro variante="ideia" size={64} />
            <Cerebro variante="inclusivo" size={64} />
          </div>
          <h2 className="text-3xl font-extrabold leading-tight">
            Mais tempo para ensinar, menos tempo planejando.
          </h2>
          <p className="mt-3 max-w-md text-sm opacity-90">
            Planejamento inteligente e inclusivo para professores da educação básica.
          </p>
        </div>
        <p className="text-xs opacity-70">Escola Municipal João Bento de Paiva</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm animar-entrada">
          <Link to="/" className="lg:hidden">
            <Logo />
          </Link>
          <h1 className="mt-8 text-2xl font-bold">
            {cadastro ? "Criar conta" : "Que bom te ver de novo!"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {cadastro
              ? "Preencha seus dados para começar a planejar."
              : "Entre para acessar seus planejamentos, atividades e materiais salvos."}
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={entrarComGoogle}
            className="mt-6 w-full gap-2"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z"
              />
              <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1z" />
              <path
                fill="#EA4335"
                d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"
              />
            </svg>
            Continuar com Google
          </Button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {cadastro && (
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="professor@escola.edu.br"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button
              type="button"
              onClick={recuperarSenha}
              className="text-sm font-medium text-brand-purple hover:underline"
            >
              Esqueci minha senha
            </button>

            <Button
              type="submit"
              disabled={carregando}
              className="w-full bg-brand text-primary-foreground shadow-glow"
            >
              {carregando ? "Aguarde…" : cadastro ? "Criar conta" : "Entrar"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            {cadastro ? (
              <Link to="/login" className="font-medium text-foreground hover:underline">
                Já tenho conta
              </Link>
            ) : (
              <Link
                to="/login"
                search={{ modo: "cadastro" }}
                className="font-medium text-foreground hover:underline"
              >
                Criar conta
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
