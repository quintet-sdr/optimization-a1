import { expect, test } from "bun:test";

import { maximize, type SimplexResult } from "./main";

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

  // FIXME: set correct values
  const right: SimplexResult = { x: [0], max: 0 };

  expect(left).toBe(right);
});

// test("lab-2-problem-1", () => {
//   const left = maximize(
//     [100, 140, 120],
//     [
//       [3, 6, 7],
//       [2, 1, 8],
//       [1, 1, 1],
//       [5, 3, 3],
//     ],
//     [135, 260, 220, 360],
//   );

//   const right: SimplexResult = {};

//   expect(left).toBe(right);
// });
