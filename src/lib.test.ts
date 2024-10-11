import { expect, test } from "bun:test";

import { maximize, type SimplexResult } from "./lib";

const PRECISION: number = 3;

test("tut-3", () => {
  const left = maximize(
    [10, 20],
    [
      [-1, 2],
      [1, 1],
      [5, 3],
    ],
    [15, 12, 45],
    PRECISION,
  );
  const right: SimplexResult = { x: [3, 9], max: 210 };

  assertEq(left, right);
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
    PRECISION,
  );
  const right: SimplexResult = { x: [0, 8, 20], max: 400 };

  assertEq(left, right);
});

test("lab-3-problem-3", () => {
  const left = maximize(
    [2, -2, 6],
    [
      [2, 1, -2],
      [1, 2, 4],
      [1, -1, 2],
    ],
    [24, 23, 10],
    PRECISION,
  );
  const right: SimplexResult = { x: [0, 3 / 4, 43 / 8], max: 123 / 4 };

  assertEq(left, right);
});

function assertEq(left: SimplexResult, right: SimplexResult): void | never {
  expect(left.max).toBeCloseTo(right.max, PRECISION);
  left.x.forEach((_, i) =>
    expect(left.x[i]).toBeCloseTo(right.x[i], PRECISION),
  );
}
