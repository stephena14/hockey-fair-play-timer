import { useEffect } from "react";

export function useLiveGameRecovery({
  enabled,
  teamId,
  players,
  dressedIds,
  assignments,
  gamePositions,
  activeDoor,
  setRecovery,
}) {
  useEffect(() => {
    if (!enabled || !players.length) return;

    setRecovery({
      teamId,
      players,
      dressedIds,
      assignments,
      gamePositions,
      activeDoor,
      savedAt: Date.now(),
    });
  }, [
    enabled,
    teamId,
    players,
    dressedIds,
    assignments,
    gamePositions,
    activeDoor,
    setRecovery,
  ]);
}
