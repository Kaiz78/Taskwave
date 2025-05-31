import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TimeUnit = {
  value: number;
  singular: string;
  plural: string;
};

type FormatDistanceOptions = {
  addSuffix?: boolean;
  language?: "fr" | "en";
};

/**
 * Une implémentation native de formatDistanceToNow pour remplacer date-fns.
 * Calcule la distance temporelle entre une date et maintenant.
 *
 * @param date - La date à comparer avec maintenant
 * @param options - Options de formatage
 * @returns Une chaîne décrivant la distance temporelle
 */
export function formatDistanceToNow(date: Date, options: FormatDistanceOptions = {}): string {
  const { addSuffix = false, language = "fr" } = options;

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const isPast = diffInSeconds > 0;
  const absDiff = Math.abs(diffInSeconds);

  // Définition des unités temporelles pour le français
  const timeUnits: TimeUnit[] =
    language === "fr"
      ? [
          { value: 60 * 60 * 24 * 365, singular: "an", plural: "ans" },
          { value: 60 * 60 * 24 * 30, singular: "mois", plural: "mois" },
          { value: 60 * 60 * 24 * 7, singular: "semaine", plural: "semaines" },
          { value: 60 * 60 * 24, singular: "jour", plural: "jours" },
          { value: 60 * 60, singular: "heure", plural: "heures" },
          { value: 60, singular: "minute", plural: "minutes" },
          { value: 1, singular: "seconde", plural: "secondes" },
        ]
      : [
          { value: 60 * 60 * 24 * 365, singular: "year", plural: "years" },
          { value: 60 * 60 * 24 * 30, singular: "month", plural: "months" },
          { value: 60 * 60 * 24 * 7, singular: "week", plural: "weeks" },
          { value: 60 * 60 * 24, singular: "day", plural: "days" },
          { value: 60 * 60, singular: "hour", plural: "hours" },
          { value: 60, singular: "minute", plural: "minutes" },
          { value: 1, singular: "second", plural: "seconds" },
        ];

  // Trouver l'unité la plus appropriée
  let unit = timeUnits[timeUnits.length - 1]; // Par défaut, secondes
  let count = absDiff;

  for (let i = 0; i < timeUnits.length; i++) {
    if (absDiff >= timeUnits[i].value) {
      unit = timeUnits[i];
      count = Math.floor(absDiff / unit.value);
      break;
    }
  }

  // Formater la chaîne résultante
  const unitName = count === 1 ? unit.singular : unit.plural;
  let result = `${count} ${unitName}`;

  // Ajouter le suffixe si demandé
  if (addSuffix) {
    if (language === "fr") {
      result = isPast ? `il y a ${result}` : `dans ${result}`;
    } else {
      result = isPast ? `${result} ago` : `in ${result}`;
    }
  }

  return result;
}

/**
 * Formate une date pour affichage dans l'interface
 *
 * @param date - La date à formater
 * @param locale - La locale à utiliser pour le formatage (fr-FR par défaut)
 * @returns Une chaîne représentant la date formatée
 */
export function formatDateToString(date: Date | string | undefined | null, locale: string = "fr-FR"): string {
  if (!date) return "";
  
  try {
    // Si c'est une chaîne, convertir en objet Date
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    // Vérifier si la date est valide
    if (isNaN(dateObj.getTime())) {
      console.error("formatDateToString - Date invalide:", date);
      return "";
    }
    
    return dateObj.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("formatDateToString - Erreur de formatage:", error);
    return "";
  }
}

/**
 * S'assure qu'une valeur est bien un objet Date valide
 * Utile pour normaliser les dates qui peuvent venir de différentes sources (API, localStorage, etc.)
 * 
 * @param value - La valeur à convertir en Date
 * @returns Un objet Date valide ou undefined si la conversion échoue
 */
export function ensureValidDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  
  try {
    // Si c'est déjà une Date, vérifier qu'elle est valide
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? undefined : value;
    }
    
    // Si c'est une chaîne ou un nombre, essayer de convertir
    const dateObj = new Date(value as string | number);
    return isNaN(dateObj.getTime()) ? undefined : dateObj;
  } catch (error) {
    console.error("Erreur lors de la conversion en Date:", error);
    return undefined;
  }
}



/**
 * Génère une couleur aléatoire pour un tableau en utilisant son ID
 * 
 * @param boardId - L'ID du tableau pour lequel générer une couleur
 * @returns Une couleur hexadécimale unique basée sur l'ID du tableau
 */
  export function getRandomColor(id: string): string {
    // Utiliser une simple fonction de hachage pour obtenir une couleur cohérente
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convertir en couleur hexadécimale
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    
    return color;
  };
