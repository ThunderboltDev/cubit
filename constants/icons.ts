import type { FC } from "react";
import type { SvgProps } from "react-native-svg";
import TwoByTwo from "@/assets/puzzles/222.svg";
import ThreeByThree from "@/assets/puzzles/333.svg";
// import ThreeBLD from "@/assets/puzzles/333bld.svg";
// import ThreeFMC from "@/assets/puzzles/333fmc.svg";
// import MultiBlind from "@/assets/puzzles/333mbf.svg";
// import ThreeOH from "@/assets/puzzles/333oh.svg";
// import FourByFour from "@/assets/puzzles/444.svg";
// import FourBLD from "@/assets/puzzles/444bld.svg";
// import FiveByFive from "@/assets/puzzles/555.svg";
// import FiveBLD from "@/assets/puzzles/555bld.svg";
// import SixBySix from "@/assets/puzzles/666.svg";
// import SevenBySeven from "@/assets/puzzles/777.svg";
// import Clock from "@/assets/puzzles/clock.svg";
// import Megaminx from "@/assets/puzzles/minx.svg";
// import Pyraminx from "@/assets/puzzles/pyrm.svg";
// import Skewb from "@/assets/puzzles/skewb.svg";
// import Square1 from "@/assets/puzzles/sq1.svg";
import type { Puzzle } from "@/types";

export const puzzleIcons: Record<Puzzle, FC<SvgProps>> = {
  "2x2": TwoByTwo,
  "3x3": ThreeByThree,
  // "4x4": FourByFour,
  // "5x5": FiveByFive,
  // "6x6": SixBySix,
  // "7x7": SevenBySeven,
  // "3x3 OH": ThreeOH,
  // "3x3 BLD": ThreeBLD,
  // "3x3 FMC": ThreeFMC,
  // "4x4 BLD": FourBLD,
  // "5x5 BLD": FiveBLD,
  // "Megaminx": Megaminx,
  // "Pyraminx": Pyraminx,
  // "Skewb": Skewb,
  // "Square-1": Square1,
  // "Clock": Clock,
  // "Multi-Blind": MultiBlind,
};
