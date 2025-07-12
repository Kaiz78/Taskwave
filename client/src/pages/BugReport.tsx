// Page pour signaler un bug
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Footer } from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import { LAYOUT } from "@/constants/ui";
import { FaBug, FaCheckCircle } from "react-icons/fa";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export default function BugReport() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    email: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation de base
    if (!formData.description) {
      toast.error("Veuillez décrire le bug rencontré.");
      return;
    }

    setIsSubmitting(true);

    // Envoi au webhook Discord
    try {
      const webhookUrl =
        "https://discord.com/api/webhooks/1392081465222762496/NjnZe9AoJ_p4wzWAzxrqFXlyzgoxWrtFCeSgDlzuVB3-oXN_riHhd5G4AD_bPQ5PWBlG";

      // Construction du message pour Discord
      const payload = {
        content: "Nouveau rapport de bug",
        embeds: [
          {
            title: formData.title || "Bug signalé",
            description: formData.description,
            color: 15258703, // Couleur rouge
            fields: [
              {
                name: "Contact",
                value: formData.email || "Non spécifié",
                inline: true,
              },
            ],
            footer: {
              text: "Envoyé depuis le formulaire de bug de TaskWave",
            },
            timestamp: new Date().toISOString(),
          },
        ],
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Échec de l'envoi");
      }

      setIsSubmitted(true);
      toast.success(
        "Bug signalé avec succès. Merci de nous aider à améliorer TaskWave !"
      );
    } catch {
      toast.error("Une erreur s'est produite lors de l'envoi du rapport.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/landing")}
          >
            <img
              src="/src/assets/logo.svg"
              alt="TaskWave Logo"
              className={LAYOUT.LOGO_SIZE}
            />
            <span className="font-bold text-xl">TaskWave</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => navigate("/landing")}>
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {isSubmitted ? (
          <Card className="max-w-xl mx-auto px-4 py-8 text-center">
            <CardHeader className="text-center">
              <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
              <CardTitle className="text-2xl">Merci !</CardTitle>
              <CardDescription className="text-lg mt-2">
                C'est noté ! Nous allons examiner ce problème rapidement.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center pt-6">
              <Button onClick={() => navigate("/landing")}>
                Retour à l'accueil
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaBug className="text-primary text-2xl" />
              </div>
              <h1 className="text-3xl font-bold">
                Vous avez rencontré un problème ?
              </h1>
              <p className="text-muted-foreground mt-2">
                Dites-nous ce qui ne va pas, nous nous en occupons.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">
                  Titre du problème (optionnel)
                </label>
                <Input
                  id="title"
                  name="title"
                  placeholder="En quelques mots, de quoi s'agit-il ?"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Décrivez ce qui ne fonctionne pas{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Expliquez simplement ce qui ne va pas..."
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email de contact (optionnel)
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Pour vous tenir informé des suites données"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="min-w-[200px]"
                >
                  {isSubmitting ? "Envoi en cours..." : "Signaler le bug"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
