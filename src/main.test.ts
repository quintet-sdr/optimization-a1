import { expect, test } from "bun:test";

import { maximize, type SimplexResult } from "./main";

test("problem-1", () => {
  const left = maximize(
    [8, 7, 5],
    [
      [2, 3, 4],
      [3, 2, 1],
      [5, 4, 3],
    ],
    [100, 90, 120]
  );
  const right: SimplexResult = { x: [10, 0, 15], max: 145 };

  assertEq(left, right);
});

test("problem-2", () => {
  const left = maximize(
    [5, 8, 11],
    [
      [4, 6, 8],
      [2, 3, 5],
      [3, 4, 6],
    ],
    [240, 160, 300]
  );
  const right: SimplexResult = { x: [20, 0, 30], max: 470 };

  assertEq(left, right);
});

test("problem-3", () => {
  const left = maximize(
    [15, 25, 30],
    [
      [5, 7, 6],
      [3, 4, 5],
      [4, 3, 2],
    ],
    [300, 180, 150]
  );
  const right: SimplexResult = { x: [10, 20, 0], max: 700 };

  assertEq(left, right);
});

test("problem-4", () => {
  const left = maximize(
    [3, 5, 7],
    [
      [1, 3, 2],
      [2, 2, 5],
      [4, 1, 3],
    ],
    [120, 150, 180]
  );
  const right: SimplexResult = { x: [30, 0, 24], max: 246 };

  assertEq(left, right);
});

test("problem-5", () => {
  const left = maximize(
    [9, 10, 16],
    [
      [18, 15, 12],
      [6, 4, 8],
      [5, 3, 3],
    ],
    [360, 192, 180]
  );
  const right: SimplexResult = { x: [0, 8, 20], max: 400 };

  assertEq(left, right);
});

test("lab-3-problem-3", () => {
  console.log();
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
});

function assertEq(left: SimplexResult, right: SimplexResult): void | never {
  const PRECISION: number = 3;

  expect(left.max).toBeCloseTo(right.max, PRECISION);
  left.x.forEach((_, i) =>
    expect(left.x[i]).toBeCloseTo(right.x[i], PRECISION)
  );
}
