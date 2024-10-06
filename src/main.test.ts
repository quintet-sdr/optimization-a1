import { expect, test } from "bun:test";

import { maximize } from "./main";

test("Sample test", () => {
  expect(maximize([1, 2, 3], true)).toBe(42);
});
