import { useState, useEffect } from 'react';

// Extend the Window interface to include the MSStream property found on iOS devices
declare global {
  interface Window {
    MSStream?: any;
  }
  interface Navigator {
    standalone?: boolean;
  }
}

// Extend Event to include beforeinstallprompt properties
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isPromptDismissed, setIsPromptDismissed] = useState(false);

  useEffect(() => {
    // 1. Check if the app is already installed
    // Matches standard display-mode: standalone (Android/Desktop)
    const isStandaloneDisplayMode = window.matchMedia('(display-mode: standalone)').matches;
    // Matches iOS standalone (Safari)
    const isIOSStandalone = window.navigator.standalone === true;

    if (isStandaloneDisplayMode || isIOSStandalone) {
      setIsStandalone(true);
    }

    // 2. Detect iOS device for manual prompt instructions
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /ipad|iphone|ipod/.test(userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // 3. Listen for Android/Chrome instant prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Check if the user previously dismissed the custom prompt
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed === 'true') {
      setIsPromptDismissed(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return;

    // Show the native install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  const dismissPrompt = () => {
    setIsPromptDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  const shouldShowPrompt = !isStandalone && !isPromptDismissed && (isIOS || !!deferredPrompt);

  return {
    isIOS,
    isStandalone,
    deferredPrompt,
    installPWA,
    dismissPrompt,
    shouldShowPrompt,
  };
}
