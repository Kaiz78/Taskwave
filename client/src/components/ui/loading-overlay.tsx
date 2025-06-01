

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  opacity?: number;
  position?: "full" | "bottom-right";
}

export function LoadingOverlay({
  isLoading,
  message = "Chargement en cours...",
  opacity = 0.7,
  position = "bottom-right",
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  if (position === "full") {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-40 transition-opacity duration-300"
        style={{ backgroundColor: `rgba(0, 0, 0, ${opacity})` }}
      >
        <div className="bg-background rounded-lg p-6 shadow-xl flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-foreground font-medium">{message}</p>
        </div>
      </div>
    );
  }

  // Version discrète en bas à droite
  return (
    <div className="fixed bottom-4 right-4 z-40 transition-opacity duration-300">
      <div className="bg-background rounded-full p-2 shadow-xl flex items-center">
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
        <p className="text-foreground text-sm mr-1">{message}</p>
      </div>
    </div>
  );
}

export default LoadingOverlay;
