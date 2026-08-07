import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Cerebro } from "@/components/mascotes/Cerebros";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Redefinir senha — Simplifica+ Tech" },
      {
        name: "description",
        content: "Defina uma nova senha para sua conta do Simplifica+ Tech.",
      },
      { property: "og:title", content: "Redefinir senha — Simplifica+ Tech" },
      { property: "og:description", content: "Crie uma nova senha de acesso." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RedefinirSenha,
});

function RedefinirSenha() {
  const navigate = useNavigate();
  const [senha, setSenha] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (senha.length < 6) {
      toast.error("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    setSalvando(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setSalvando(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Senha atualizada!");
    navigate({ to: "/painel" });
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form onSubmit={salvar} className="card-surface animar-entrada w-full max-w-sm space-y-4 p-6">
        <Cerebro variante="inclusivo" size={56} />
        <h1 className="font-display text-xl font-bold">Definir nova senha</h1>
        <div className="space-y-2">
          <Label htmlFor="nova">Nova senha</Label>
          <Input
            id="nova"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <Button type="submit" disabled={salvando} className="w-full bg-brand text-primary-foreground">
          {salvando ? "Salvando…" : "Salvar senha"}
        </Button>
      </form>
    </div>
  );
}
