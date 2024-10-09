import { expect, test } from "bun:test";

import { maximize } from "./main";

test("Sample test", () => {
  const left = maximize(
    [9, 10, 16],
    [
      { a: [18, 15, 12], b: 360 },
      { a: [6, 4, 8], b: 192 },
      { a: [5, 3, 3], b: 180 },
    ],
  );
  const right = 42;

  expect(left).toBe(right);
});
