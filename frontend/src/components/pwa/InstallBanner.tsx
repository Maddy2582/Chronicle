import { useEffect, useState } from "react";

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<any>(null);

  useEffect(() => {
    const handler = (event: any) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handler
    );

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handler
      );
  }, []);

  if (!deferredPrompt) return null;

  return (
    <div className="fixed left-4 right-4 top-4 z-50 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-white shadow-xl">

      <div className="flex items-center justify-between gap-3">

        <div>
          <p className="font-semibold">
            Install Chronicle
          </p>

          <p className="text-sm text-zinc-400">
            Open it like a real app.
          </p>
        </div>

        <button
          onClick={async () => {
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            setDeferredPrompt(null);
          }}
          className="rounded-lg bg-white px-3 py-2 text-sm text-black"
        >
          Install
        </button>

      </div>

    </div>
  );
}