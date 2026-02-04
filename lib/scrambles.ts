import type { Puzzle } from "@/types";

const standardFaces = ["R", "L", "U", "D", "F", "B"];

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function oppositeFace(face: string): string {
  const opposites: Record<string, string> = {
    R: "L",
    L: "R",
    U: "D",
    D: "U",
    F: "B",
    B: "F",
  };
  return opposites[face] || "";
}

export function generate2x2Scramble(length: number = 11): string {
  const moves = ["R", "R'", "R2", "F", "F'", "F2", "U", "U'", "U2"];
  const result: string[] = [];

  let lastFace = "";

  for (let i = 0; i < length; i++) {
    let move: string;

    do {
      move = pickRandom(moves);
    } while (move[0] === lastFace);

    result.push(move);
    lastFace = move[0];
  }

  return result.join(" ");
}

export function generate3x3Scramble(length: number = 25): string {
  const result: string[] = [];

  let lastFace = "";
  let secondLastFace = "";

  for (let i = 0; i < length; i++) {
    let face: string;
    let suffix: string;

    do {
      face = pickRandom(standardFaces);
      suffix = pickRandom(["", "'", "2"]);
    } while (
      face === lastFace ||
      (face === oppositeFace(lastFace) && secondLastFace === oppositeFace(face))
    );

    result.push(face + suffix);
    secondLastFace = lastFace;
    lastFace = face;
  }

  return result.join(" ");
}

export function generate4x4Scramble(length: number = 40): string {
  const result: string[] = [];

  let lastFace = "";

  for (let i = 0; i < length; i++) {
    let face: string;
    let wide: string;
    let suffix: string;

    do {
      face = pickRandom(standardFaces);
      wide = Math.random() > 0.5 ? "w" : "";
      suffix = pickRandom(["", "'", "2"]);
    } while (face === lastFace);

    result.push(face + wide + suffix);
    lastFace = face;
  }

  return result.join(" ");
}

export function generate5x5Scramble(length: number = 60): string {
  return generate4x4Scramble(length);
}

export function generate6x6Scramble(length: number = 80): string {
  const result: string[] = [];
  let lastFace = "";

  for (let i = 0; i < length; i++) {
    let face: string;
    let wide: string;
    let suffix: string;

    do {
      face = pickRandom(standardFaces);
      const r = Math.random();
      if (r < 0.6) wide = "";
      else if (r < 0.8) wide = "w";
      else wide = "2w";
      suffix = pickRandom(["", "'", "2"]);
    } while (face === lastFace);

    result.push(face + wide + suffix);
    lastFace = face;
  }

  return result.join(" ");
}

export function generate7x7Scramble(length: number = 100): string {
  const result: string[] = [];

  let lastFace = "";

  for (let i = 0; i < length; i++) {
    let face: string;
    let wide: string;
    let suffix: string;

    do {
      face = pickRandom(standardFaces);
      const r = Math.random();
      if (r < 0.6) wide = "";
      else if (r < 0.8) wide = "w";
      else wide = pickRandom(["2w", "3w"]);
      suffix = pickRandom(["", "'", "2"]);
    } while (face === lastFace);

    result.push(face + wide + suffix);
    lastFace = face;
  }

  return result.join(" ");
}

export function generateMegaminxScramble(length: number = 77): string {
  const faces = ["R", "D", "U", "B", "L"];
  const result: string[] = [];

  let lastFace = "";

  for (let i = 0; i < length; i++) {
    let face: string;
    let suffix: string;

    do {
      face = pickRandom(faces);
      suffix = pickRandom(["++", "--"]);
    } while (face === lastFace);

    result.push(face + suffix);
    lastFace = face;

    if ((i + 1) % 10 === 0) result.push("\n");
  }

  return result.join(" ");
}

export function generatePyraminxScramble(length: number = 11): string {
  const tips = ["u", "u'", "b", "b'", "l", "l'", "r", "r'"];
  const result: string[] = [];

  let lastFace = "";

  for (let i = 0; i < length - 4; i++) {
    let face: string;
    let suffix: string;

    do {
      face = pickRandom(["U", "R", "L", "B"]);
      suffix = pickRandom(["", "'"]);
    } while (face === lastFace);

    result.push(face + suffix);
    lastFace = face;
  }

  const tipCount = randInt(0, 4);
  for (let i = 0; i < tipCount; i++) {
    result.push(pickRandom(tips));
  }

  return shuffle(result).join(" ");
}

export function generateSkewbScramble(length: number = 11): string {
  const moves = ["R", "R'", "L", "L'", "U", "U'", "B", "B'"];
  const result: string[] = [];

  let lastFace = "";

  for (let i = 0; i < length; i++) {
    let move: string;

    do {
      move = pickRandom(moves);
    } while (move[0] === lastFace);

    result.push(move);
    lastFace = move[0];
  }

  return result.join(" ");
}

export function generateSquare1Scramble(length: number = 20): string {
  const result: string[] = [];

  for (let i = 0; i < length; i++) {
    const top = randInt(-5, 6);
    const bottom = randInt(-5, 6);
    result.push(`(${top}, ${bottom})`);

    if (i % 2 === 0 && i !== length - 1) {
      result.push("/");
    }
  }

  return result.join(" ");
}

export function generateClockScramble(): string {
  const pins = ["UR", "DR", "DL", "UL", "U", "R", "D", "L", "ALL"];
  const wheels = [
    "0+",
    "1+",
    "2+",
    "3+",
    "4+",
    "5+",
    "6-",
    "5-",
    "4-",
    "3-",
    "2-",
    "1-",
  ];

  const result: string[] = [];

  const pinSeq = shuffle(pins.slice(0, 4));
  result.push(...pinSeq.map((p) => `${p} ${Math.random() > 0.5 ? "u" : "d"}`));

  for (const pin of pins) {
    result.push(`${pin}${pickRandom(wheels)}`);
  }

  return result.join(" ");
}

export const SCRAMBLE_LENGTHS: Record<Puzzle, number> = {
  "2x2": 11,
  "3x3": 25,
  // "4x4": 40,
  // "5x5": 60,
  // "6x6": 80,
  // "7x7": 100,
  // "3x3 OH": 25,
  // "3x3 BLD": 25,
  // "3x3 FMC": 0, // not implemented yet
  // "4x4 BLD": 40,
  // "5x5 BLD": 60,
  // "Megaminx": 77,
  // "Pyraminx": 11,
  // "Skewb": 11,
  // "Square-1": 20,
  // "Clock": 0,
  // "Multi-Blind": 25,
};

export function generateScramble(puzzle: Puzzle): string {
  switch (puzzle) {
    case "2x2":
      return generate2x2Scramble();
    case "3x3":
      // case "3x3 OH":
      // case "3x3 BLD":
      return generate3x3Scramble();
    // case "4x4":
    // case "4x4 BLD":
    //   return generate4x4Scramble();
    // case "5x5":
    // case "5x5 BLD":
    //   return generate5x5Scramble();
    // case "6x6":
    //   return generate6x6Scramble();
    // case "7x7":
    //   return generate7x7Scramble();
    // case "Megaminx":
    //   return generateMegaminxScramble();
    // case "Pyraminx":
    //   return generatePyraminxScramble();
    // case "Skewb":
    //   return generateSkewbScramble();
    // case "Square-1":
    //   return generateSquare1Scramble();
    // case "Clock":
    //   return generateClockScramble();
    // case "3x3 FMC":
    //   return "Not implemented yet.";
    // case "Multi-Blind":
    //   return generate3x3Scramble();
    default:
      return "Scramble not available";
  }
}
