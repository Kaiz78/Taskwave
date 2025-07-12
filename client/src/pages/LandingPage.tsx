// Landing page publique accessible à tous les utilisateurs
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuthStore } from "@/store/useAuthStore";
import { LAYOUT } from "@/constants/ui";

import {
  FaRocket,
  FaClipboardCheck,
  FaChartLine,
  FaUsers,
  FaCode,
  FaBug,
  FaEnvelope,
  FaCalendarAlt,
  FaDiscord,
} from "react-icons/fa";

export default function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = () => {
    if (isAuthenticated) {
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/src/assets/logo.svg"
              alt="TaskWave Logo"
              className={LAYOUT.LOGO_SIZE}
            />
            <span className="font-bold text-xl">TaskWave</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button onClick={login}>
              {isAuthenticated ? "Mon tableau de bord" : "Se connecter"}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block bg-primary text-primary-foreground text-xs px-3 py-1 font-bold rounded-full mb-4">
            VERSION BETA
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simplifiez votre gestion de tâches avec TaskWave
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Une application moderne de gestion de tâches avec des tableaux
            kanban intuitifs. Conçue pour les équipes et les individus qui
            veulent rester organisés et productifs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={login}>
              {isAuthenticated
                ? "Accéder à mon espace"
                : "Commencer maintenant"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("#fonctionnalites")}
            >
              Explorer les fonctionnalités
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fonctionnalites" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Fonctionnalités principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 border rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FaClipboardCheck className="text-primary text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tableaux Kanban</h3>
              <p className="text-muted-foreground">
                Organisez vos tâches visuellement avec des colonnes
                personnalisables et le glisser-déposer intuitif.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 border rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FaRocket className="text-primary text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Palette de commandes
              </h3>
              <p className="text-muted-foreground">
                Naviguez et effectuez des actions rapidement avec notre palette
                de commandes inspirée des éditeurs de code modernes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 border rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FaChartLine className="text-primary text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Organisation des tableaux
              </h3>
              <p className="text-muted-foreground">
                Gérez efficacement plusieurs tableaux de projet avec un système
                d'organisation flexible et intuitif.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Feuille de route
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            TaskWave évolue constamment. Voici les fonctionnalités sur
            lesquelles nous travaillons pour les prochaines versions.
          </p>

          <div className="max-w-4xl mx-auto">
            {/* Version 0.2.0 */}
            <div className="mb-8 border-l-4 border-primary pl-6 py-2 relative">
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-[10px]"></div>
              <h3 className="text-2xl font-semibold mb-2">
                Version 0.2.0 - Amélioration UX & Nouvelles fonctionnalités
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Accessibilité UX & UI</h4>
                    <p className="text-sm text-muted-foreground">
                      Améliorations de l'interface utilisateur pour tous
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaRocket className="text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">
                      Améliorations de performance
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Optimisation du drag-and-drop et des temps de chargement
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaChartLine className="text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Filtres & recherche avancés</h4>
                    <p className="text-sm text-muted-foreground">
                      Trouvez rapidement vos tâches grâce à des filtres et une
                      recherche puissante
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaClipboardCheck className="text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Archivage</h4>
                    <p className="text-sm text-muted-foreground">
                      Archivez tableaux et tâches complétées pour garder votre
                      espace organisé
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Version 0.3.0 */}
            <div className="border-l-4 border-primary/50 pl-6 py-2 relative">
              <div className="absolute w-4 h-4 bg-primary/50 rounded-full -left-[10px]"></div>
              <h3 className="text-2xl font-semibold mb-2">
                Version 0.3.0 - Collaboration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-start gap-3">
                  <FaUsers className="text-primary/50 mt-1" />
                  <div>
                    <h4 className="font-medium">Partage de tableaux</h4>
                    <p className="text-sm text-muted-foreground">
                      Partagez vos tableaux avec d'autres utilisateurs
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCode className="text-primary/50 mt-1" />
                  <div>
                    <h4 className="font-medium">
                      Contrôle d'accès & permissions
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Définissez les droits de lecture seule ou d'édition pour
                      chaque collaborateur
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaEnvelope className="text-primary/50 mt-1" />
                  <div>
                    <h4 className="font-medium">Commentaires sur les tâches</h4>
                    <p className="text-sm text-muted-foreground">
                      Discutez et échangez directement sur chaque tâche
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaUsers className="text-primary/50 mt-1" />
                  <div>
                    <h4 className="font-medium">Mentions d'utilisateurs</h4>
                    <p className="text-sm text-muted-foreground">
                      Mentionnez vos collègues dans les commentaires pour les
                      notifier
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaChartLine className="text-primary/50 mt-1" />
                  <div>
                    <h4 className="font-medium">Activité en temps réel</h4>
                    <p className="text-sm text-muted-foreground">
                      Voyez qui modifie quoi en temps réel sur vos tableaux
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="text-primary/50 mt-1" />
                  <div>
                    <h4 className="font-medium">Vue Calendrier</h4>
                    <p className="text-sm text-muted-foreground">
                      Visualisez vos tâches avec dates d'échéance dans un
                      calendrier
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Support */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Contact & Support
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Bug Reports */}
            <div className="p-6 border rounded-lg text-center">
              <FaBug className="mx-auto text-2xl mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Signaler un bug</h3>
              <p className="text-muted-foreground mb-4">
                Vous avez trouvé un problème ? Signalez-le pour nous aider à
                améliorer.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/bug-report")}
              >
                Ouvrir un ticket
              </Button>
            </div>

            {/* Discord */}
            <div className="p-6 border rounded-lg text-center">
              <FaDiscord className="mx-auto text-2xl mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Rejoignez-nous</h3>
              <p className="text-muted-foreground mb-4">
                Rejoignez notre communauté Discord pour échanger et contribuer !
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  window.open("https://discord.gg/AGvrnNCNYN", "_blank")
                }
              >
                Discord
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à essayer TaskWave ?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Créez votre compte gratuitement et commencez à organiser vos tâches
            dès aujourd'hui.
          </p>
          <Button size="lg" onClick={login}>
            {isAuthenticated
              ? "Accéder à mon espace"
              : "Créer un compte gratuit"}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
