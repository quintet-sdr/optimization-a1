type Constraint = {
  coeffs: number[];
  rhs: number;
};

export function maximize(coeffs: number[], constraints: Constraint[]): number {
  console.log("Starting the simplex algorithm.");
  console.log(`Function: ${coeffsToFn(coeffs)}`);

  constraints.forEach((c, i) => {
    if (c.coeffs.length !== coeffs.length) {
      throw new Error(
        `numbers of coefficients don't match:\n` +
          ` function: ${coeffs} (${coeffs.length})\n` +
          ` constraint ${i + 1}: ${c.coeffs} (${c.coeffs.length})`
      );
    }
  });

  const table = arrayOf(
    constraints.length + 1,
    // arrayOf(, 0)
    0 // FIXME
  );

  // TODO: algorithm

  console.log(table);

  return 42;
}

function arrayOf<T>(n: number, item: T): T[] {
  return new Array(n).fill(item);
}

function coeffsToFn(coeffs: number[]): string {
  return coeffs.map((it, i) => `${it}*x[${i + 1}]`).join(" + ");
}
