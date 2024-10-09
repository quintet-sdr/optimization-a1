export function maximize(
  c: number[],
  a: number[][],
  b: number[],
): number | never {
  simplex_assert(c, a, b);

  console.log("Starting the simplex algorithm.");
  console.log(`Function: ${fnOfXs(c.length)} = ${coeffsToFn(c)}`);

  const xes = c.map((_, i) => `x[${i + 1}]`);
  const ses = a.map((_, i) => `s[${i + 1}]`);

  const rowNames = ["z", ...ses];
  const colNames = [...xes, ...ses, "Solution", "Ratio"];

  const table = arrayOf(constraints.length + 1, () =>
    arrayOf(c.length + constraints.length + 2, () => 0),
  );

  prettyPrintWith(table, rowNames, colNames);
  console.log();

  // Z-row
  for (let i = 0; i < c.length; i++) {
    table[0][i] = -1 * c[i];
  }

  for (let i = 0; i < constraints.length; i += 1) {
    // Xes
    for (let j = 0; j < c.length; j += 1) {
      table[i + 1][j] = constraints[i].a[j];
    }

    // Ses
    table[i + 1][c.length + i] = 1;

    // Solution-row
    table[i + 1][c.length + constraints.length] = constraints[i].b;
  }

  prettyPrintWith(table, rowNames, colNames);

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

function prettyPrintWith(
  tableau: number[][],
  rowNames: string[],
  colNames: string[],
): void {
  prettyPrint([
    ["Basic", ...colNames],
    ...tableau.map((row, i) => [rowNames[i], ...row]),
  ]);
}

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

function simplex_assert(c: number[], a: number[][], b: number[]): void | never {
  if (a.length !== b.length) {
    throw new Error(
      `numbers of constraints and right-hand sides don't match':\n` +
        ` constraints: ${a} (${a.length})` +
        ` right-hand sides: ${b} (${b.length})\n`,
    );
  }

  a.forEach((row, i) => {
    if (row.length !== c.length) {
      throw new Error(
        `numbers of coefficients don't match:\n` +
          ` function: ${c} (${c.length})\n` +
          ` constraint ${i + 1}: ${row} (${row.length})`,
      );
    }
  });
}
