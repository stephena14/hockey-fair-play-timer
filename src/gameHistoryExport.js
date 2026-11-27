const STORAGE_KEY = "hockeyCurrentGameDetails";

const emptyDetails = () => ({
  shifts: [],
  whistles: [],
  whistleStartedAt: null,
});

const readDetails = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...emptyDetails(), ...JSON.parse(saved) } : emptyDetails();
  } catch {
    return emptyDetails();
  }
};

const saveDetails = (details) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
};

const timestamp = (value) => new Date(value).toISOString();

export const resetGameDetails = () => saveDetails(emptyDetails());

export const recordShift = (player, endedAt = Date.now()) => {
  const details = readDetails();
  const playerShifts = details.shifts.filter(
    (shift) => shift.playerId === player.id,
  );

  details.shifts.push({
    shiftNumber: playerShifts.length + 1,
    playerId: player.id,
    number: player.number,
    fullName: player.fullName,
    nickname: player.nickname,
    position: player.gamePosition || player.position || "",
    role: player.role,
    line: player.line,
    durationMs: Math.max(0, Math.round(player.shiftMs || 0)),
    endedAt: timestamp(endedAt),
  });
  saveDetails(details);
};

export const startWhistle = (startedAt = Date.now()) => {
  const details = readDetails();
  if (details.whistleStartedAt === null) {
    details.whistleStartedAt = startedAt;
    saveDetails(details);
  }
};

export const endWhistle = (endedAt = Date.now()) => {
  const details = readDetails();
  if (details.whistleStartedAt === null) return;

  details.whistles.push({
    whistleNumber: details.whistles.length + 1,
    durationMs: Math.max(0, endedAt - details.whistleStartedAt),
    startedAt: timestamp(details.whistleStartedAt),
    endedAt: timestamp(endedAt),
  });
  details.whistleStartedAt = null;
  saveDetails(details);
};

export const finishGameDetails = (endedAt = Date.now()) => {
  endWhistle(endedAt);
  const details = readDetails();
  return { shifts: details.shifts, whistles: details.whistles };
};

const tsvCell = (value) =>
  String(value ?? "")
    .replace(/[\t\r\n]+/g, " ")
    .trim();

const seconds = (milliseconds) => (Math.max(0, milliseconds || 0) / 1000).toFixed(2);

const row = (...cells) => cells.map(tsvCell).join("\t");

export const createGameTextExport = (game) => {
  const lines = [
    row("Hockey Fair Play Timer - Game Export"),
    row("Game Summary"),
    row("Team", game.teamName),
    row("Saved", game.savedAt),
    "",
    row("Player Summary"),
    row("Number", "Player", "Position", "Line / Pair", "Total ice time (seconds)", "Shifts recorded"),
    ...game.players.map((player) =>
      row(
        player.number,
        player.fullName || player.nickname,
        player.gamePosition || player.position || "",
        player.role === "defence" ? `Pair ${player.line}` : `Line ${player.line}`,
        seconds(player.totalMs),
        (game.shifts || []).filter((shift) => shift.playerId === player.id).length,
      ),
    ),
    "",
    row("Shift Details"),
    row("Shift", "Number", "Player", "Position", "Line / Pair", "Duration (seconds)", "Ended"),
  ];

  if (game.shifts?.length) {
    lines.push(
      ...game.shifts.map((shift) =>
        row(
          shift.shiftNumber,
          shift.number,
          shift.fullName || shift.nickname,
          shift.position,
          shift.role === "defence" ? `Pair ${shift.line}` : `Line ${shift.line}`,
          seconds(shift.durationMs),
          shift.endedAt,
        ),
      ),
    );
  } else {
    lines.push(row("No shift details recorded for this game."));
  }

  lines.push(
    "",
    row("Whistle Durations"),
    row("Whistle", "Duration (seconds)", "Started", "Ended"),
  );

  if (game.whistles?.length) {
    lines.push(
      ...game.whistles.map((whistle) =>
        row(
          whistle.whistleNumber,
          seconds(whistle.durationMs),
          whistle.startedAt,
          whistle.endedAt,
        ),
      ),
    );
  } else {
    lines.push(row("No whistle durations recorded for this game."));
  }

  return `${lines.join("\r\n")}\r\n`;
};

const downloadTextFile = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
};

export const shareGameTextExport = async (game) => {
  const safeTeamName = (game.teamName || "team").replace(/[^a-z0-9-_]+/gi, "-");
  const date = new Date(game.id || Date.now()).toISOString().slice(0, 10);
  const fileName = `hockey-game-${safeTeamName}-${date}.txt`;
  const content = createGameTextExport(game);
  const file =
    typeof File !== "undefined"
      ? new File([content], fileName, { type: "text/plain;charset=utf-8" })
      : null;

  if (
    file &&
    navigator.share &&
    (!navigator.canShare || navigator.canShare({ files: [file] }))
  ) {
    try {
      await navigator.share({
        files: [file],
        title: `${game.teamName} game data`,
      });
      return "Game data shared.";
    } catch (error) {
      if (error?.name === "AbortError") return "Sharing cancelled.";
      throw error;
    }
  }

  downloadTextFile(
    new Blob([content], { type: "text/plain;charset=utf-8" }),
    fileName,
  );
  return "Game data downloaded as a tab-delimited text file.";
};
