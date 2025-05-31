import { KeyboardIcon, BookOpen, ExternalLink } from "lucide-react";

export default function Help() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Centre d'aide Taskwave
      </h1>

      {/* Section d'utilisation du site */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-6 w-6" />
          <h2 className="text-2xl font-semibold">Guide d'utilisation</h2>
        </div>

        <div className="grid gap-6 mt-6">
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="text-xl font-medium mb-3">Tableaux Kanban</h3>
            <p className="mb-3 text-muted-foreground">
              Les tableaux Kanban vous permettent d'organiser votre travail de
              manière visuelle et efficace.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Créez un nouveau tableau depuis la page d'accueil</li>
              <li>
                Ajoutez des colonnes pour représenter les différentes étapes de
                votre processus
              </li>
              <li>Créez des tâches dans chaque colonne</li>
              <li>
                Faites glisser les tâches entre les colonnes pour mettre à jour
                leur statut
              </li>
              <li>Cliquez sur une tâche pour voir ou modifier ses détails</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h3 className="text-xl font-medium mb-3">Gestion des tâches</h3>
            <p className="mb-3 text-muted-foreground">
              Créez et gérez vos tâches pour rester organisé et productif.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Attribuez des priorités aux tâches (Faible, Normale, Haute,
                Urgente)
              </li>
              <li>Ajoutez des dates d'échéance pour suivre les délais</li>
              <li>
                Utilisez la fonction de recherche pour retrouver rapidement des
                tâches spécifiques
              </li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h3 className="text-xl font-medium mb-3">Palette de commandes</h3>
            <p className="mb-3 text-muted-foreground">
              Utilisez la palette de commandes pour accéder rapidement aux
              fonctionnalités sans utiliser la souris.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Appuyez sur{" "}
                <kbd className="px-2 py-1 bg-muted rounded border text-xs font-mono">
                  Ctrl+K
                </kbd>{" "}
                pour ouvrir la palette
              </li>
              <li>Tapez pour rechercher une commande</li>
              <li>Utilisez les flèches pour naviguer entre les résultats</li>
              <li>
                Appuyez sur{" "}
                <kbd className="px-2 py-1 bg-muted rounded border text-xs font-mono">
                  Entrée
                </kbd>{" "}
                pour exécuter la commande sélectionnée
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section des raccourcis clavier */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <KeyboardIcon className="h-6 w-6" />
          <h2 className="text-2xl font-semibold">Raccourcis clavier</h2>
        </div>

        <div className="bg-card rounded-lg p-6 border mt-4">
          <p className="text-muted-foreground mb-4">
            Utilisez ces raccourcis clavier pour naviguer plus rapidement dans
            l'application.
          </p>

          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Raccourci</th>
                <th className="text-left py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">
                  <kbd className="px-2 py-1 bg-muted rounded border text-xs font-mono">
                    Ctrl+K
                  </kbd>
                </td>
                <td className="py-3 px-4">
                  Ouvrir/fermer la palette de commandes
                </td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-4">
                  <kbd className="px-2 py-1 bg-muted rounded border text-xs font-mono">
                    Ctrl+B
                  </kbd>
                </td>
                <td className="py-3 px-4">Ouvrir/fermer la barre latérale</td>
              </tr>
              
            </tbody>
          </table>
        </div>
      </section>

      {/* Section de contact ou ressources supplémentaires */}
      <section className="mt-12 text-center text-muted-foreground">
        <p className="mb-2">
          Vous avez d'autres questions? Consultez notre documentation complète
        </p>
        <a
          href="https://github.com/AletWork/Taskwave/tree/main/docs"
          className="inline-flex items-center gap-1 text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation <ExternalLink className="h-3 w-3" />
        </a>
      </section>
    </div>
  );
}
