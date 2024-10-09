export type SimplexResult = {
  x: number[];
  max: number;
};

export function maximize(
  c: number[], // coefficitents of the objective function
  a: number[][], // coefficients of the constraint functions
  b: number[], // right-hand side numbers,
  eps: number,
): SimplexResult | never {
  simplexAssert(c, a, b);

  console.log("Starting the simplex algorithm.");
  console.log(`Function: ${fnOfXs(c.length)} = ${coeffsToFn(c)}`);

  const xStrings = c.map((_, i) => `x[${i + 1}]`);
  const sStrings = a.map((_, i) => `s[${i + 1}]`);

  const rowNames = ["z", ...sStrings];
  const colNames = [...xStrings, ...sStrings, "Solution", "Ratio"];

  let table = arrayOf(a.length + 1, () =>
    arrayOf(c.length + a.length + 2, () => 0),
  );

  prettyPrintWith(table, rowNames, colNames, eps);
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
  let running = true;
  let counter = 0;
  while (running) {
    console.log();
    console.log(`START OF ITERATION ${counter}`);
    // Find pivot column
    let pivotColValue = Infinity;
    let pivotColIndex = NaN;

    for (let i = 0; i <= a.length; i++) {
      for (let j = 0; j < c.length; j++) {
        if (table[i][j] < pivotColValue && j !== 0) {
          pivotColValue = table[i][j];
          pivotColIndex = j;
        }
      }
    }

    // Compute the ratio
    for (let i = 0; i <= a.length; i++) {
      table[i][c.length + b.length + 1] =
        table[i][c.length + b.length] / table[i][pivotColIndex];
    }

    // Find pivot row
    let pivotRowValue = Infinity;
    let pivotRowIndex = NaN;
    for (let i = 0; i <= a.length; i++) {
      if (
        table[i][c.length + b.length + 1] < pivotRowValue &&
        table[i][c.length + b.length + 1] > 0
      ) {
        pivotRowValue = table[i][c.length + b.length + 1];
        pivotRowIndex = i;
      }
    }

    // Find pivot element
    let pivotElement = table[pivotRowIndex][pivotColIndex];

    // Divide pivot row to pivot element
    for (let j = 0; j <= c.length + b.length; j++) {
      table[pivotRowIndex][j] = table[pivotRowIndex][j] / pivotElement;
    }
    console.log(
      `Pivot column element: ${colNames[pivotColIndex]} = ${pivotColValue}`,
    );
    console.log(
      `Pivot row element: ${rowNames[pivotRowIndex]} = ${pivotRowValue}`,
    );
    console.log(`Pivot element: ${pivotElement}`);
    console.log();
    console.log("INITIAL TABLE:");
    prettyPrintWith(table, rowNames, colNames, eps);
    //Make pivot column to 0
    let tableTmp = table.map((row) => row.slice());
    for (let i = 0; i <= a.length; i++) {
      for (let j = 0; j <= c.length + a.length; j++) {
        if (i != pivotRowIndex) {
          tableTmp[i][j] =
            table[i][j] - table[i][pivotColIndex] * table[pivotRowIndex][j];
        }
      }
    }
    table = tableTmp;

    // Changing basis
    rowNames[pivotColIndex] = colNames[pivotRowIndex];
    console.log();
    console.log("TABLE AFTER ITERATION:");
    prettyPrintWith(table, rowNames, colNames, eps);

    if (table[0].filter((it) => it < 0).length === 0) {
      running = false;
    }
    console.log();
    console.log(`END OF ITERATION ${counter}`);
    counter += 1;
  }

  console.log();
  console.log("Final table:");
  prettyPrintWith(table, rowNames, colNames, eps);

  let answer = table[0][c.length + a.length];
  let xIndexes = arrayOf(c.length, () => 0);
  console.log(rowNames);
  for (let i = 1; i < rowNames.length; i++) {
    if (rowNames[i].startsWith("x")) {
      xIndexes[
        Number.parseInt(rowNames[i].slice(2, rowNames[i].length - 1)) - 1
      ] = table[i][c.length + a.length];
    }
  }
  console.log(answer);
  console.log(xIndexes);

  return {
    x: xIndexes,
    max: answer,
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
  colNames: string[],
  precision: number,
): void {
  prettyPrint([
    ["Basic", ...colNames],
    ...tableau.map((row, i) => [
      rowNames[i],
      ...row.map((num) => num.toFixed(precision)),
    ]),
  ]);
}

function prettyPrint(tableau: string[][]) {
  let colMaxes = [];
  for (let i = 0; i < tableau[0].length; i += 1) {
    colMaxes.push(
      Math.max.apply(
        null,
        tableau.map((row) => row[i]).map((n) => n.length),
      ),
    );
  }

  tableau.forEach((row) =>
    console.log.apply(
      null,
      row.map(
        (val, j) =>
          `${new Array(colMaxes[j] - val.length + 1).join(" ")}${val}  `,
      ),
    ),
  );
}

function simplexAssert(c: number[], a: number[][], b: number[]): void | never {
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
