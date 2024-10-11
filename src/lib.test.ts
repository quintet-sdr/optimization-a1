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
  const right: SimplexResult = { solverState: "solved", x: [3, 9], z: 210 };

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
  const right: SimplexResult = { solverState: "solved", x: [0, 8, 20], z: 400 };

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
  const right: SimplexResult = {
    solverState: "solved",
    x: [0, 3 / 4, 43 / 8],
    z: 123 / 4,
  };

  assertEq(left, right);
});

test("unbounded-1", () => {
  const left = maximize(
    [2, 1],
    [
      [1, -1],
      [2, 0],
    ],
    [10, 40],
    PRECISION,
  );
  const right: SimplexResult = { solverState: "unbounded" };

  assertEq(left, right);
});

test("unbounded-2", () => {
  const left = maximize(
    [3, 2],
    [
      [1, -1],
      [-2, 1],
    ],
    [2, -1],
    PRECISION,
  );
  const right: SimplexResult = { solverState: "unbounded" };

  assertEq(left, right);
});

function assertEq(left: SimplexResult, right: SimplexResult): void | never {
  expect(left.solverState).toBe(right.solverState);

  // HACK: this allows TypeScript to validate types.
  if (left.solverState === "unbounded" || right.solverState === "unbounded") {
    return;
  }

  expect(left.z).toBeCloseTo(right.z, PRECISION);
  left.x.forEach((_, i) =>
    expect(left.x[i]).toBeCloseTo(right.x[i], PRECISION),
  );
}
