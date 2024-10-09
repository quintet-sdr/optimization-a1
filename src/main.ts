import { maximize, type SimplexResult } from "./simplex";

console.log("problem-1");
const left1 = maximize(
  [8, 7, 5],
  [
    [2, 3, 4],
    [3, 2, 1],
    [5, 4, 3],
  ],
  [100, 90, 120],
);
const right1: SimplexResult = { x: [10, 0, 15], max: 145 };
assertEq(left1, right1);

console.log("problem-2");
const left2 = maximize(
  [5, 8, 11],
  [
    [4, 6, 8],
    [2, 3, 5],
    [3, 4, 6],
  ],
  [240, 160, 300],
);
const right2: SimplexResult = { x: [20, 0, 30], max: 470 };
assertEq(left2, right2);

console.log("problem-3");
const left3 = maximize(
  [15, 25, 30],
  [
    [5, 7, 6],
    [3, 4, 5],
    [4, 3, 2],
  ],
  [300, 180, 150],
);
const right3: SimplexResult = { x: [10, 20, 0], max: 700 };
assertEq(left3, right3);

console.log("problem-4");
const left4 = maximize(
  [3, 5, 7],
  [
    [1, 3, 2],
    [2, 2, 5],
    [4, 1, 3],
  ],
  [120, 150, 180],
);
const right4: SimplexResult = { x: [30, 0, 24], max: 246 };
assertEq(left4, right4);

console.log("problem-5");
const left5 = maximize(
  [9, 10, 16],
  [
    [18, 15, 12],
    [6, 4, 8],
    [5, 3, 3],
  ],
  [360, 192, 180],
);
const right5: SimplexResult = { x: [0, 8, 20], max: 400 };
assertEq(left5, right5);

function assertEq(left: SimplexResult, right: SimplexResult): void | never {
  const maxCheck: boolean = compare(left.max, right.max);

  const xCheck = left.x.every((_, i) => compare(left.x[i], right.x[i]));

  if (xCheck && maxCheck) {
    console.log("\n******PASSED******\n");
  } else {
    console.log("\n******FAILED******\n");
  }
}

function compare(a: number, b: number, precision: number = 0.0005): boolean {
  return Math.abs(a - b) < precision;
}
