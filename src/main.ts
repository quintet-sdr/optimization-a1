type Constraint = {
  coeffs: number[];
  rhs: number;
};

export function maximize(coeffs: number[], constraints: Constraint[]): number {
  console.log("Starting the simplex algorithm.");
  console.log(`Function: ${fnOfXs(coeffs.length)} = ${coeffsToFn(coeffs)}`);

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
    arrayOf(coeffs.length + constraints.length + 2, 0)
  );

  console.log(table);

  // Z-row
  for (let i = 0; i < coeffs.length; i++) {
    table[0][i] = -1 * coeffs[i];
  }

  //
constraints.forEach((cst, i) => {
  for (let j = 0; j < coeffs.length; j += 1) {
    table[i+1][j]=cst.coeffs[j];
  }
});
  //

  for (let i = 0; i < constraints.length; i += 1) {
    for (let j = 0; j < coeffs.length; j += 1) {
      table[i + 1][j] = constraints[i].coeffs[j];
    }
    for(let j = 0; j < constraints.length; j += 1) {
      table[i + 1][coeffs.length + j] = 1;
    }
    table[i + 1][coeffs.length + constraints.length] = constraints[i].rhs;
  }

  console.log(table);

  return 42;
}

function arrayOf<T>(n: number, item: T): T[] {
  return new Array(n).fill(item);
}

function fnOfXs(n: number): string {
  const xs = [];
  for (let i = 1; i <= n; i += 1) {
    xs.push(`x[${i}]`);
  }

  return `F(${xs.join(", ")})`;
}

function coeffsToFn(coeffs: number[]): string {
  return coeffs.map((it, i) => `${it}*x[${i + 1}]`).join(" + ");
}

// .|.
