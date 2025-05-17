import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type TimeUnit = {
  value: number;
  singular: string;
  plural: string;
}

type FormatDistanceOptions = {
  addSuffix?: boolean;
  language?: 'fr' | 'en';
}

/**
 * Une implémentation native de formatDistanceToNow pour remplacer date-fns.
 * Calcule la distance temporelle entre une date et maintenant.
 * 
 * @param date - La date à comparer avec maintenant
 * @param options - Options de formatage
 * @returns Une chaîne décrivant la distance temporelle
 */
export function formatDistanceToNow(date: Date, options: FormatDistanceOptions = {}): string {
  const { addSuffix = false, language = 'fr' } = options;
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const isPast = diffInSeconds > 0;
  const absDiff = Math.abs(diffInSeconds);
  
  // Définition des unités temporelles pour le français
  const timeUnits: TimeUnit[] = language === 'fr' ? [
    { value: 60 * 60 * 24 * 365, singular: "an", plural: "ans" },
    { value: 60 * 60 * 24 * 30, singular: "mois", plural: "mois" },
    { value: 60 * 60 * 24 * 7, singular: "semaine", plural: "semaines" },
    { value: 60 * 60 * 24, singular: "jour", plural: "jours" },
    { value: 60 * 60, singular: "heure", plural: "heures" },
    { value: 60, singular: "minute", plural: "minutes" },
    { value: 1, singular: "seconde", plural: "secondes" }
  ] : [
    { value: 60 * 60 * 24 * 365, singular: "year", plural: "years" },
    { value: 60 * 60 * 24 * 30, singular: "month", plural: "months" },
    { value: 60 * 60 * 24 * 7, singular: "week", plural: "weeks" },
    { value: 60 * 60 * 24, singular: "day", plural: "days" },
    { value: 60 * 60, singular: "hour", plural: "hours" },
    { value: 60, singular: "minute", plural: "minutes" },
    { value: 1, singular: "second", plural: "seconds" }
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
    if (language === 'fr') {
      result = isPast ? `il y a ${result}` : `dans ${result}`;
    } else {
      result = isPast ? `${result} ago` : `in ${result}`;
    }
  }
  
  return result;
}
