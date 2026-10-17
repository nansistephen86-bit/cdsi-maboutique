import { useState, type FormEvent } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site-config";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search.next === "string" ? search.next : "/compte",
  }),
  component: Login,
  head: () => ({
    meta: [{ title: `Connexion — ${siteConfig.nomCourt}` }],
  }),
});

function Login() {
  const { next } = Route.useSearch();
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const callbackURL = next.startsWith("/") ? next : "/compte";

  if (!isPending && user) {
    return <Navigate to={callbackURL.startsWith("/panier") ? "/panier" : "/compte"} />;
  }

  async function handleEmail(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0] || "Client CDSI",
        });
        if (err) throw new Error(err.message || "Inscription impossible");
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) throw new Error(err.message || "Connexion impossible");
      }
      await authClient.getSession();
      window.location.assign(callbackURL);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="px-5 py-16">
      <div className="mx-auto max-w-md">
        <p className="mb-1 font-display text-[1.05rem] text-ochre-dark italic">Compte</p>
        <h1 className="text-display font-medium">
          {mode === "signin" ? "Connexion" : "Créer un compte"}
        </h1>
        <p className="mb-8 text-charcoal-soft">
          Connectez-vous pour commander, suivre vos paiements et retrouver vos commandes.
        </p>

        {!authEnabled ? (
          <p className="text-charcoal-soft">La connexion n'est pas encore activée.</p>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="secondary"
                  onClick={() => signIn(p.providerId, { callbackURL })}
                >
                  Continuer avec {p.label}
                </Button>
              ))}
            </div>

            <p className="my-6 text-center text-sm text-charcoal-soft">ou avec votre e-mail</p>

            <form className="grid gap-4" onSubmit={handleEmail}>
              {mode === "signup" && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-sm font-semibold">
                    Nom
                  </label>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="min-h-12 rounded-sm border-[1.5px] border-sand-dark bg-white px-3.5 py-3"
                  />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-semibold">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-12 rounded-sm border-[1.5px] border-sand-dark bg-white px-3.5 py-3"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-semibold">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="min-h-12 rounded-sm border-[1.5px] border-sand-dark bg-white px-3.5 py-3"
                />
              </div>
              {error && <p className="text-sm font-medium text-danger">{error}</p>}
              <Button type="submit" size="lg" disabled={busy}>
                {busy
                  ? "Veuillez patienter…"
                  : mode === "signin"
                    ? "Se connecter"
                    : "Créer mon compte"}
              </Button>
            </form>

            <p className="mt-5 text-sm">
              {mode === "signin" ? (
                <button type="button" className="font-semibold text-forest-dark hover:underline" onClick={() => setMode("signup")}>
                  Pas encore de compte ? Inscription
                </button>
              ) : (
                <button type="button" className="font-semibold text-forest-dark hover:underline" onClick={() => setMode("signin")}>
                  Déjà un compte ? Connexion
                </button>
              )}
            </p>
          </>
        )}

        <p className="mt-8 text-sm">
          <Link to="/" className="text-charcoal-soft hover:text-forest-dark">
            Retour à l'accueil
          </Link>
        </p>
      </div>
    </section>
  );
}
