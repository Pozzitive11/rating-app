import { useState, useEffect } from "react";
import { Download, X, Share } from "lucide-react";
import { Button } from "./index";
import { usePWAInstall } from "../hooks/usePWAInstall";

export const InstallPrompt = () => {
  const { isIOS, installPWA, dismissPrompt, shouldShowPrompt } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add a slight delay before showing the prompt to not overwhelm the user immediately
    if (shouldShowPrompt) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [shouldShowPrompt]);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    dismissPrompt();
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] sm:left-auto sm:right-4 sm:w-96 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-background border shadow-lg rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-between items-start gap-4">
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <img src="/pwa-192x192.png" alt="Іконка додатка" className="w-8 h-8 rounded-lg object-cover shadow-sm" />
            </div>
            
            <div className="flex flex-col">
              <h3 className="font-semibold text-foreground">Встановити Beer Rater</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isIOS 
                  ? "Отримайте повний функціонал на головному екрані." 
                  : "Встановіть наш додаток для кращої та швидшої роботи."}
              </p>
            </div>
          </div>

          <button 
            onClick={handleDismiss}
            className="text-muted-foreground hover:bg-muted p-1 rounded-full transition-colors shrink-0"
            aria-label="Закрити"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-2 text-sm bg-muted/50 p-3 rounded-lg border border-border/50">
          {isIOS ? (
            <div className="flex flex-col gap-2">
              <p className="font-medium text-foreground flex items-center gap-2">
                <Share className="size-4 text-primary" />
                Натисніть кнопку "Поділитися"
              </p>
              <p className="text-muted-foreground flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded bg-background border text-xs font-medium shrink-0">+</span>
                Потім "Додати на початковий екран"
              </p>
            </div>
          ) : (
            <Button 
              onClick={installPWA} 
              className="w-full gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all"
            >
              <Download className="size-4" />
              Встановити зараз
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
