import { useEffect } from "react";

export function useOnIceTimer({ paused, screen, setPlayers }) {
  useEffect(() => {
    let last = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - last;
      last = now;

      if (screen === "game" && !paused) {
        setPlayers((players) =>
          players.map((player) =>
            player.onIce
              ? {
                  ...player,
                  shiftMs: player.shiftMs + elapsed,
                  totalMs: player.totalMs + elapsed,
                }
              : player
          )
        );
      }
    }, 250);

    return () => clearInterval(timer);
  }, [paused, screen, setPlayers]);
}
