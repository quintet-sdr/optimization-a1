import { expect, test } from "bun:test";

import { maximize, type SimplexResult } from "./main";

test("lab-2-problem-1", () => {
  const left = maximize(
    [100, 140, 120],
    [
      [3, 6, 7],
      [2, 1, 8],
      [1, 1, 1],
      [5, 3, 3],
    ],
    [135, 260, 220, 360],
  );
  // const right: SimplexResult = {};
  //
  // assertEq(left, right);
});

test("lab-3-problem-1", () => {
  const left = maximize(
    [9, 10, 16],
    [
      [18, 15, 12],
      [6, 4, 8],
      [5, 3, 3],
    ],
    [360, 192, 180],
  );
  const right: SimplexResult = { x: [0, 8, 20], max: 400 };

  assertEq(left, right);
});

// test("lab-3-problem-3", () => {
//   const left = maximize(
//   );
//   const right: SimplexResult = { };
//
//   assertEq(left, right);
// });

function assertEq(left: SimplexResult, right: SimplexResult): void | never {
  const PRECISION: number = 3;

  expect(left.max).toBeCloseTo(right.max, PRECISION);
  left.x.forEach((_, i) =>
    expect(left.x[i]).toBeCloseTo(right.x[i], PRECISION),
  );
}
