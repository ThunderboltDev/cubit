import type { Solve } from "@/types/puzzles";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const MIN_TIME_MS = 3_000;
const MAX_TIME_MS = 60_000;

const SCRAMBLE_MOVES = [
  "R",
  "R'",
  "R2",
  "L",
  "L'",
  "L2",
  "U",
  "U'",
  "U2",
  "D",
  "D'",
  "D2",
  "F",
  "F'",
  "F2",
  "B",
  "B'",
  "B2",
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateFakeScramble(): string {
  const length = randomInt(15, 25);
  const moves: string[] = [];
  let lastFace = "";

  for (let i = 0; i < length; i++) {
    let move: string;
    do {
      move = SCRAMBLE_MOVES[randomInt(0, SCRAMBLE_MOVES.length - 1)];
    } while (move[0] === lastFace);
    lastFace = move[0];
    moves.push(move);
  }

  return moves.join(" ");
}

function randomPenalty(): "OK" | "+2" | "DNF" {
  const roll = Math.random();
  if (roll < 0.02) return "DNF";
  if (roll < 0.07) return "+2";
  return "OK";
}

export function generateBulkSolves(
  puzzleId: string,
  count: number,
  multiphaseEnabled = false,
  multiphaseCount = 0,
): Solve[] {
  const now = Date.now();
  const solves: Solve[] = [];

  for (let i = 0; i < count; i++) {
    const time = randomInt(MIN_TIME_MS, MAX_TIME_MS);
    const phases =
      multiphaseEnabled && multiphaseCount > 0
        ? Array.from({ length: multiphaseCount }, () =>
            Math.floor(time / multiphaseCount),
          )
        : undefined;

    if (phases) {
      const sum = phases.reduce((a, b) => a + b, 0);
      phases[phases.length - 1] += time - sum;
    }

    if (multiphaseEnabled && multiphaseCount > 0 && phases) {
      solves.push({
        kind: "multiphase",
        id: crypto.randomUUID(),
        puzzleId,
        time,
        phases,
        scramble: generateFakeScramble(),
        penalty: randomPenalty(),
        createdAt: now - Math.floor(Math.random() * THIRTY_DAYS_MS),
      });
    } else {
      solves.push({
        kind: "base",
        id: crypto.randomUUID(),
        puzzleId,
        time,
        scramble: generateFakeScramble(),
        penalty: randomPenalty(),
        createdAt: now - Math.floor(Math.random() * THIRTY_DAYS_MS),
      });
    }
  }

  return solves;
}
