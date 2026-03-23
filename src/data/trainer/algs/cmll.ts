import type { AlgSet } from "@/types/trainer";

export const CMLL: AlgSet = {
  id: "cmll",
  name: "CMLL",
  puzzleTypes: ["333", "333oh"],
  orientation: "x2",
  cases: {
    // O (Corners Oriented) - 2 cases
    "cmll-o-adj": {
      id: "cmll-o-adj",
      name: "O Adjacent",
      alg: "R U R' F' R U R' U' R' F R2 U' R'",
    },
    "cmll-o-diag": {
      id: "cmll-o-diag",
      name: "O Diagonal",
      alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
    },
    // H (Double Headlights) - 4 cases
    "cmll-h-columns": {
      id: "cmll-h-columns",
      name: "H Columns",
      alg: "R U2 R' U' R U R' U' R U' R'",
    },
    "cmll-h-rows": {
      id: "cmll-h-rows",
      name: "H Rows",
      alg: "F R U R' U' R U R' U' R U R' U' F'",
    },
    "cmll-h-column": {
      id: "cmll-h-column",
      name: "H Column",
      alg: "R U2' R2' F R F' U2 R' F R F'",
    },
    "cmll-h-row": {
      id: "cmll-h-row",
      name: "H Row",
      alg: "r U' r2' D' r U' r' D r2 U r'",
    },
    // Pi (Bruno) - 6 cases
    "cmll-pi-right": {
      id: "cmll-pi-right",
      name: "Pi Right Bar",
      alg: "F R U R' U' R U R' U' F'",
    },
    "cmll-pi-backslash": {
      id: "cmll-pi-backslash",
      name: "Pi Back Slash",
      alg: "F R' F' R U2 R U' R' U R U2' R'",
    },
    "cmll-pi-x": {
      id: "cmll-pi-x",
      name: "Pi X Checkerboard",
      alg: "R' F R U F U' R U R' U' F'",
    },
    "cmll-pi-forward": {
      id: "cmll-pi-forward",
      name: "Pi Forward Slash",
      alg: "R U2 R' U' R U R' U2' R' F R F'",
    },
    "cmll-pi-columns": {
      id: "cmll-pi-columns",
      name: "Pi Columns",
      alg: "r U' r2' D' r U r' D r2 U r'",
    },
    "cmll-pi-left": {
      id: "cmll-pi-left",
      name: "Pi Left Bar",
      alg: "R' U' R' F R F' R U' R' U2 R",
    },
    // U (Headlights) - 6 cases
    "cmll-u-forward": {
      id: "cmll-u-forward",
      name: "U Forward Slash",
      alg: "R2 D R' U2 R D' R' U2 R'",
    },
    "cmll-u-backslash": {
      id: "cmll-u-backslash",
      name: "U Back Slash",
      alg: "R2' D' R U2 R' D R U2 R",
    },
    "cmll-u-front": {
      id: "cmll-u-front",
      name: "U Front Row",
      alg: "R2' F U' F U F2 R2 U' R' F R",
    },
    "cmll-u-rows": {
      id: "cmll-u-rows",
      name: "U Rows",
      alg: "F R2 D R' U R D' R2' U' F'",
    },
    "cmll-u-x": {
      id: "cmll-u-x",
      name: "U X Checkerboard",
      alg: "r U' r' U r' D' r U' r' D r",
    },
    "cmll-u-back": {
      id: "cmll-u-back",
      name: "U Back Row",
      alg: "F R U R' U' F'",
    },
    // T (Chameleon) - 6 cases
    "cmll-t-left": {
      id: "cmll-t-left",
      name: "T Left Bar",
      alg: "R U R' U' R' F R F'",
    },
    "cmll-t-right": {
      id: "cmll-t-right",
      name: "T Right Bar",
      alg: "L' U' L U L F' L' F",
    },
    "cmll-t-rows": {
      id: "cmll-t-rows",
      name: "T Rows",
      alg: "F R' F R2 U' R' U' R U R' F2",
    },
    "cmll-t-front": {
      id: "cmll-t-front",
      name: "T Front Row",
      alg: "r' U r U2' R2' F R F' R",
    },
    "cmll-t-back": {
      id: "cmll-t-back",
      name: "T Back Row",
      alg: "r' D' r U r' D r U' r U r'",
    },
    "cmll-t-columns": {
      id: "cmll-t-columns",
      name: "T Columns",
      alg: "r2' D' r U r' D r2 U' r' U' r",
    },
    // S (Sune) - 6 cases
    "cmll-s-left": {
      id: "cmll-s-left",
      name: "Sune Left Bar",
      alg: "R U R' U R U2 R'",
    },
    "cmll-s-x": {
      id: "cmll-s-x",
      name: "Sune X Checkerboard",
      alg: "L' U2 L U2' L F' L' F",
    },
    "cmll-s-forward": {
      id: "cmll-s-forward",
      name: "Sune Forward Slash",
      alg: "F R' F' R U2 R U2' R'",
    },
    "cmll-s-columns": {
      id: "cmll-s-columns",
      name: "Sune Columns",
      alg: "R U R' U' R' F R F' R U R' U R U2' R'",
    },
    "cmll-s-right": {
      id: "cmll-s-right",
      name: "Sune Right Bar",
      alg: "R U R' U R' F R F' R U2' R'",
    },
    "cmll-s-backslash": {
      id: "cmll-s-backslash",
      name: "Sune Back Slash",
      alg: "R U' L' U R' U' L",
    },
    // As (Antisune) - 6 cases
    "cmll-as-right": {
      id: "cmll-as-right",
      name: "Antisune Right Bar",
      alg: "R' U' R U' R' U2 R",
    },
    "cmll-as-columns": {
      id: "cmll-as-columns",
      name: "Antisune Columns",
      alg: "R2 D R' U R D' R' U R' U' R U' R'",
    },
    "cmll-as-backslash": {
      id: "cmll-as-backslash",
      name: "Antisune Back Slash",
      alg: "F' r U r' U2 r' F2 r",
    },
    "cmll-as-x": {
      id: "cmll-as-x",
      name: "Antisune X Checkerboard",
      alg: "R U2 R' U2 R' F R F'",
    },
    "cmll-as-forward": {
      id: "cmll-as-forward",
      name: "Antisune Forward Slash",
      alg: "R' F R F' r U r'",
    },
    "cmll-as-left": {
      id: "cmll-as-left",
      name: "Antisune Left Bar",
      alg: "R U2 R' F R' F' R U' R U' R'",
    },
    // L (Bowtie) - 6 cases
    "cmll-l-mirror": {
      id: "cmll-l-mirror",
      name: "L Mirror",
      alg: "R U2 R' U' R U R' U' R U' R'",
    },
    "cmll-l-inverse": {
      id: "cmll-l-inverse",
      name: "L Inverse",
      alg: "R U2 R' U' R U' R2 U2 R U R' U R",
    },
    "cmll-l-pure": {
      id: "cmll-l-pure",
      name: "L Pure",
      alg: "R U2' R' U2 R' F R F' U2' r U2' r'",
    },
    "cmll-l-front": {
      id: "cmll-l-front",
      name: "L Front Commutator",
      alg: "R' U2 R' D' R U2 R' D R2",
    },
    "cmll-l-diag": {
      id: "cmll-l-diag",
      name: "L Diagonal",
      alg: "R U2 R D R' U2 R D' R2'",
    },
    "cmll-l-back": {
      id: "cmll-l-back",
      name: "L Back Commutator",
      alg: "R U R' U R U2' R' r U R' U R U2' r'",
    },
  },
  groups: [
    {
      id: "o",
      name: "O (Oriented)",
      caseIds: ["cmll-o-adj", "cmll-o-diag"],
    },
    {
      id: "h",
      name: "H (Double Headlights)",
      caseIds: ["cmll-h-columns", "cmll-h-rows", "cmll-h-column", "cmll-h-row"],
    },
    {
      id: "pi",
      name: "Pi (Bruno)",
      caseIds: [
        "cmll-pi-right",
        "cmll-pi-backslash",
        "cmll-pi-x",
        "cmll-pi-forward",
        "cmll-pi-columns",
        "cmll-pi-left",
      ],
    },
    {
      id: "u",
      name: "U (Headlights)",
      caseIds: [
        "cmll-u-forward",
        "cmll-u-backslash",
        "cmll-u-front",
        "cmll-u-rows",
        "cmll-u-x",
        "cmll-u-back",
      ],
    },
    {
      id: "t",
      name: "T (Chameleon)",
      caseIds: [
        "cmll-t-left",
        "cmll-t-right",
        "cmll-t-rows",
        "cmll-t-front",
        "cmll-t-back",
        "cmll-t-columns",
      ],
    },
    {
      id: "s",
      name: "S (Sune)",
      caseIds: [
        "cmll-s-left",
        "cmll-s-x",
        "cmll-s-forward",
        "cmll-s-columns",
        "cmll-s-right",
        "cmll-s-backslash",
      ],
    },
    {
      id: "as",
      name: "As (Antisune)",
      caseIds: [
        "cmll-as-right",
        "cmll-as-columns",
        "cmll-as-backslash",
        "cmll-as-x",
        "cmll-as-forward",
        "cmll-as-left",
      ],
    },
    {
      id: "l",
      name: "L (Bowtie)",
      caseIds: [
        "cmll-l-mirror",
        "cmll-l-inverse",
        "cmll-l-pure",
        "cmll-l-front",
        "cmll-l-diag",
        "cmll-l-back",
      ],
    },
    {
      id: "2look-cmll",
      name: "2-Look CMLL",
      caseIds: [
        "cmll-s-left",
        "cmll-as-right",
        "cmll-t-left",
        "cmll-u-back",
        "cmll-o-adj",
        "cmll-o-diag",
      ],
    },
  ],
};
