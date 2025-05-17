
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
      © {currentYear} Taskwave. Tous droits réservés.
    </div>
  );
}
