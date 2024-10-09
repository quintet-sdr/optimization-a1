import { expect, test } from "bun:test";

import { maximize } from "./main";

test("Sample test", () => {
  const left = maximize(
    [9, 10, 16],
    [
      [18, 15, 12],
      [6, 4, 8],
      [5, 3, 3],
    ],
    [360, 192, 180],
  );
  const right = 42;

  expect(left).toBe(right);
});
