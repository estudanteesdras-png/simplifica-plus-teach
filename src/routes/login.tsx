import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const { login } = useApp();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || senha.length < 4) {
      toast.error("Informe um e-mail e uma senha com pelo menos 4 caracteres.");
      return;
    }
    login(email.trim(), nome);
    toast.success(cadastro ? "Conta criada com sucesso!" : "Bem-vindo(a) de volta!");
    navigate({ to: "/painel" });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-brand p-10 text-primary-foreground lg:flex">
        <Link to="/" className="text-lg font-extrabold">
          Simplifica+ Tech
        </Link>
        <div>
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
        <div className="w-full max-w-sm">
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

          <form onSubmit={submit} className="mt-8 space-y-4">
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
              onClick={() =>
                toast.info("Enviamos um link de redefinição para o e-mail informado.")
              }
              className="text-sm font-medium text-brand-purple hover:underline"
            >
              Esqueci minha senha
            </button>

            <Button type="submit" className="w-full bg-brand text-primary-foreground shadow-glow">
              {cadastro ? "Criar conta" : "Entrar"}
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