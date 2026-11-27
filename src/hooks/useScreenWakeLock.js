import { useEffect, useRef } from "react";

export function useScreenWakeLock(enabled) {
  const wakeLockRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const release = async () => {
      try {
        if (wakeLockRef.current) {
          await wakeLockRef.current.release();
        }
      } catch {
        // Wake lock release can fail while the browser is closing or resuming.
      }
      wakeLockRef.current = null;
    };

    const acquire = async () => {
      if (
        cancelled ||
        !enabled ||
        document.visibilityState !== "visible" ||
        !("wakeLock" in navigator)
      ) {
        return;
      }

      try {
        const lock = await navigator.wakeLock.request("screen");
        lock.addEventListener("release", () => {
          wakeLockRef.current = null;
        });
        wakeLockRef.current = lock;
      } catch {
        wakeLockRef.current = null;
      }
    };

    const onVisibility = async () => {
      if (document.visibilityState === "visible" && enabled) {
        await release();
        await acquire();
      }
    };

    const onFocus = async () => {
      if (enabled) {
        await release();
        await acquire();
      }
    };

    if (enabled) {
      acquire();
    } else {
      release();
    }

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      release();
    };
  }, [enabled]);
}
