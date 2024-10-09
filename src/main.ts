export type SimplexResult = {
  x: number[];
  max: number;
};

export function maximize(
  c: number[],
  a: number[][],
  b: number[]
): SimplexResult | never {
  simplex_assert(c, a, b);

  console.log("Starting the simplex algorithm.");
  console.log(`Function: ${fnOfXs(c.length)} = ${coeffsToFn(c)}`);

  const xes = c.map((_, i) => `x[${i + 1}]`);
  const ses = a.map((_, i) => `s[${i + 1}]`);

  const rowNames = ["z", ...ses];
  const colNames = [...xes, ...ses, "Solution", "Ratio"];

  const table = arrayOf(a.length + 1, () =>
    arrayOf(c.length + a.length + 2, () => 0)
  );

  prettyPrintWith(table, rowNames, colNames);
  console.log();

  // Z-row
  for (let i = 0; i < c.length; i++) {
    table[0][i] = -1 * c[i];
  }

  // BROKEN
  for (let i = 0; i < a.length; i += 1) {
    // Xes
    for (let j = 0; j < c.length; j += 1) {
      table[i + 1][j] = a[i][j];
    }

    // Ses
    table[i + 1][c.length + i] = 1;

    // Solution-row
    table[i + 1][c.length + a.length] = b[i];
  }

  prettyPrintWith(table, rowNames, colNames);
  // Find pivot column
  let pivot_col_val = 1e6;
  let pivot_col_ind = -1;
  for (let i = 0; i <= a.length; i++) {
    for (let j = 0; j < c.length; j++) {
      if (table[i][j] < pivot_col_val) {
        pivot_col_val = table[i][j];
        pivot_col_ind = j;
      }
    }
  }
  console.log(pivot_col_val, pivot_col_ind);

  // Compute the ratio
  for (let i = 0; i <= a.length; i++) {
    table[i][c.length + b.length + 1] =
      table[i][c.length + b.length] / table[i][pivot_col_ind];
  }
  prettyPrint(table);

  //Find pivot row
  let pivot_row_val = 1e6;
  let pivot_row_ind = -1;
  for (let i = 0; i <= a.length; i++) {
    if (
      table[i][c.length + b.length + 1] < pivot_row_val &&
      table[i][c.length + b.length + 1] > 0
    ) {
      pivot_row_val = table[i][c.length + b.length + 1];
      pivot_row_ind = i;
    }
  }
  console.log(pivot_row_val, pivot_row_ind);

  //Find pivot element
  let pivot_elem = table[pivot_col_ind][pivot_row_ind];
  console.log("Pivot element: ", pivot_elem);

  //Divide pivot row to pivot element
  for (let j = 0; j <= c.length + b.length; j++) {
    table[pivot_row_ind][j] = table[pivot_row_ind][j] / pivot_elem;
  }
  prettyPrint(table);

  for (let i = 0; i <= a.length; i++) {
    for (let j = 0; j <= c.length + a.length; j++) {
      if (i != pivot_row_ind) {
        table[i][j] =
          table[i][j] - table[i][pivot_col_ind] * [pivot_row_ind][j];
      }
    }
  }
  prettyPrint(table);

  return {
    x: [],
    max: 42,
  };
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
  colNames: string[]
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
        tableau.map((row) => row[i]).map((n) => n.toString().length)
      )
    );
  }

  tableau.forEach((row) =>
    console.log.apply(
      null,
      row.map(
        (val, j) =>
          `${new Array(colMaxes[j] - val.toString().length + 1).join(
            " "
          )}${val}  `
      )
    )
  );
}

function simplex_assert(c: number[], a: number[][], b: number[]): void | never {
  if (a.length !== b.length) {
    throw new Error(
      `numbers of constraints and right-hand sides don't match':\n` +
        ` constraints: ${a} (${a.length})` +
        ` right-hand sides: ${b} (${b.length})\n`
    );
  }

  a.forEach((row, i) => {
    if (row.length !== c.length) {
      throw new Error(
        `numbers of coefficients don't match:\n` +
          ` function: ${c} (${c.length})\n` +
          ` constraint ${i + 1}: ${row} (${row.length})`
      );
    }
  });
}
