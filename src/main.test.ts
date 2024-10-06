import { expect, test } from "bun:test";

import { maximize } from "./main";

test("Sample test", () => {
  const left = maximize([1, 2, 3], [{ coeffs: [1, 2, 3], rhs: 2 }]);
  const right = 42;

  expect(left).toBe(right);
});
