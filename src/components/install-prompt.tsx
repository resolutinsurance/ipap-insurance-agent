"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => void;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  }
}

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    null
  );

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window));
    setIsAndroid(/Android/.test(navigator.userAgent));
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (isStandalone) {
      // If the app is already installed, open the installed version
      window.location.href = window.location.origin;
    } else if (deferredPrompt) {
      // Show native install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setDeferredPrompt(null);
    } else {
      // Show manual installation steps
      setShowModal(true);
    }
  };

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  return (
    <>
      <Button onClick={handleInstallClick}>Install App</Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Install App</DialogTitle>
            <DialogDescription>
              Follow these steps to install the app on your device:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {isIOS && (
              <div className="space-y-2">
                <h4 className="font-medium">For iOS devices:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    Tap the share button <span className="font-mono">⎋</span> at the
                    bottom of your screen
                  </li>
                  <li>
                    Scroll down and tap <strong>Add to Home Screen</strong>{" "}
                    <span className="font-mono">➕</span>
                  </li>
                  <li>
                    Tap <strong>Add</strong> to confirm
                  </li>
                </ol>
              </div>
            )}

            {isAndroid && (
              <div className="space-y-2">
                <h4 className="font-medium">For Android devices:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    Tap the three dots menu <span className="font-mono">⋮</span> in your
                    browser
                  </li>
                  <li>
                    Select <strong>Add to Home Screen</strong> or{" "}
                    <strong>Install App</strong>
                  </li>
                  <li>
                    Tap <strong>Add</strong> or <strong>Install</strong> to confirm
                  </li>
                </ol>
              </div>
            )}

            {!isIOS && !isAndroid && (
              <div className="space-y-2">
                <h4 className="font-medium">For other browsers:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Look for an install icon in your browser&apos;s address bar</li>
                  <li>
                    Or check your browser&apos;s menu for &quot;Install&quot; or &quot;Add
                    to Home Screen&quot;
                  </li>
                  <li>Follow your browser&apos;s installation prompts</li>
                </ol>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
