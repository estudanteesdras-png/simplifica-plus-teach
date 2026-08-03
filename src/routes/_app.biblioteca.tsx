import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Cerebro } from "@/components/mascotes/Cerebros";

export const Route = createFileRoute("/_app/biblioteca")({
  component: BibliotecaBloqueada,
});

function BibliotecaBloqueada() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <section className="card-surface max-w-lg p-10 text-center">
        <div className="mx-auto mb-4 grid size-20 place-items-center rounded-3xl bg-soft">
          <Cerebro variante="pesquisador" size={56} />
        </div>
        <h1 className="text-xl font-bold">Biblioteca em manutenção</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Biblioteca em manutenção. Abertura em breve com curadoria oficial!
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          Enquanto isso, continue criando planos de aula e atividades — tudo fica salvo no seu
          histórico e nos favoritos.
        </p>
        <div className="hidden">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
