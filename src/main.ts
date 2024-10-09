import { maximize, type SimplexResult } from "./simplex";

console.log("lab-2-problem-1");
const left1 = maximize(
  [100, 140, 120],
  [
    [3, 6, 7],
    [2, 1, 8],
    [1, 1, 1],
    [5, 3, 3],
  ],
  [135, 260, 220, 360],
);
const right1: SimplexResult = { x: [0, 30, 30], max: 7800 };
assertEq(left1, right1);

console.log("lab-3-problem-1");
const left2 = maximize(
  [9, 10, 16],
  [
    [18, 15, 12],
    [6, 4, 8],
    [5, 3, 3],
  ],
  [360, 192, 180],
);
const right2: SimplexResult = { x: [0, 8, 20], max: 400 };
assertEq(left2, right2);

console.log("lab-3-problem-3");
const left = maximize(
  [2, -2, 6],
  [
    [2, 1, -2],
    [1, 2, 4],
    [1, -1, 2],
  ],
  [24, 23, 10],
);
const right: SimplexResult = { x: [0, 3 / 4, 43 / 8], max: -123 / 4 };
assertEq(left, right);

function assertEq(left: SimplexResult, right: SimplexResult): void | never {
  const maxCheck: boolean = compare(left.max, right.max);
  
  let xCheck = true;
  for (let i = 0; i <= left.x.length; i++) {
    if (compare(left.x[i], right.x[i])) {
      xCheck = false;
      break;
    }
  }
  if (xCheck && maxCheck) {
    console.log("Passed");
  } else {
    console.log("Failed");
  }
}

function compare(a: number, b: number, precision: number = 0.0005): boolean {
  return Math.abs(a - b) < precision;
}
