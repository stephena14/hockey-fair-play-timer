export const seedTeams = [];

export const fmt = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

export const roleForPosition = (position) =>
  ["LD", "RD"].includes(position) ? "defence" : "forward";

export const decode = (value, position) => ({
  role: roleForPosition(position),
  line: Number(value) || 1,
});

export const encode = (player) => player.line;

export const load = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};
