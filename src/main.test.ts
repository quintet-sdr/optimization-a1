import { expect, test } from "bun:test";

import { maximize } from "./main";

test("Sample test", () => {
  const left = maximize(
    [9, 10, 16],
    [
      { coeffs: [18, 15, 12], rhs: 360 },
      { coeffs: [6, 4, 8], rhs: 192 },
      { coeffs: [5, 3, 3], rhs: 180 },
    ],
  );
  const right = 42;

  expect(left).toBe(right);
});
