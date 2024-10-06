type Constraint = {
  coeffs: number[];
  rhs: number;
};

export function maximize(coeffs: number[], constraints: Constraint[]): number {
  console.log("Starting the simplex algorithm.");
  console.log(`Function: ${fnOfXs(coeffs.length)} = ${coeffsToFn(coeffs)}`);

  const xes = coeffs.map((_, i) => `x[${i + 1}]`);
  const ses = constraints.map((_, i) => `s[${i + 1}]`);

  const rowNames = ["z", ...ses];
  const colNames = [...xes, ...ses, "Solution", "Ratio"];

  constraints.forEach((c, i) => {
    if (c.coeffs.length !== coeffs.length) {
      throw new Error(
        `numbers of coefficients don't match:\n` +
          ` function: ${coeffs} (${coeffs.length})\n` +
          ` constraint ${i + 1}: ${c.coeffs} (${c.coeffs.length})`,
      );
    }
  });

  const table = arrayOf(constraints.length + 1, () =>
    arrayOf(coeffs.length + constraints.length + 2, () => 0),
  );

  prettyPrint(table);
  console.log();

  // Z-row
  for (let i = 0; i < coeffs.length; i++) {
    table[0][i] = -1 * coeffs[i];
  }

  for (let i = 0; i < constraints.length; i += 1) {
    // Xes
    for (let j = 0; j < coeffs.length; j += 1) {
      table[i + 1][j] = constraints[i].coeffs[j];
    }

    // Ses
    table[i + 1][coeffs.length + i] = 1;

    // Solution-row
    table[i + 1][coeffs.length + constraints.length] = constraints[i].rhs;
  }

  prettyPrint(table);

  return 42;
}

function arrayOf<T>(n: number, item: () => T): T[] {
  const a: T[] = new Array(n);

  for (let i = 0; i < n; i += 1) {
    a[i] = item();
  }

  return a;
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

// function prettyPrintWith();

function prettyPrint(tableau: (number | string)[][]) {
  let colMaxes = [];
  for (let i = 0; i < tableau[0].length; i += 1) {
    colMaxes.push(
      Math.max.apply(
        null,
        tableau.map((row) => row[i]).map((n) => n.toString().length),
      ),
    );
  }

  tableau.forEach((row) =>
    console.log.apply(
      null,
      row.map(
        (val, j) =>
          `${new Array(colMaxes[j] - val.toString().length + 1).join(" ")}${val}  `,
      ),
    ),
  );
}
