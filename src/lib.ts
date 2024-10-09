import { arrayOf, prettyPrintWith, printHeading } from "./util";

export type SimplexResult = {
  x: number[];
  max: number;
};

export function maximize(
  // coefficitents of the objective function
  c: number[],
  // coefficients of the constraint functions
  a: number[][],
  // right-hand side numbers
  b: number[],
  // precision
  eps: number,
): SimplexResult | never {
  assertLengths(c, a, b);

  const xStrings = c.map((_, i) => i + 1).map((i) => `x[${i}]`);
  const sStrings = a.map((_, i) => i + 1).map((i) => `s[${i}]`);

  console.log(
    `Function: F(${xStrings.join(", ")}) = ${c.map((coeff, i) => `${coeff}*${xStrings[i]}`).join(" + ")}`,
  );

  const rowNames = ["z", ...sStrings];
  const colNames = [...xStrings, ...sStrings, "Solution", "Ratio"];

  const tRows = 1 + a.length;
  const tCols = c.length + a.length + 2;

  let tableau = arrayOf(tRows, () => arrayOf(tCols, () => 0));

  for (let i = 0; 1 + i < tRows; i += 1) {
    for (let j = 0; j < c.length; j += 1) {
      // Z-row
      tableau[0][j] = -1 * c[j];
      // X-es
      tableau[1 + i][j] = a[i][j];
    }
    // S-es
    tableau[1 + i][c.length + i] = 1;
    // Solution row
    tableau[1 + i][tCols - 2] = b[i];
  }

  let counter = 0;
  while (true) {
    counter += 1;

    console.log();
    printHeading(`Iteration ${counter}`);
    console.log();

    const pivotCol = findPivotCol(tableau, c);

    // Compute the ratio.
    for (let i = 0; i < tRows; i += 1) {
      tableau[i][tCols - 1] = tableau[i][tCols - 2] / tableau[i][pivotCol];
    }

    const pivotRow = findPivotRow(tableau);

    const pivotElement = tableau[pivotRow][pivotCol];

    for (let j = 0; j < tCols - 1; j += 1) {
      tableau[pivotRow][j] /= pivotElement;
    }

    console.log(
      "Pivot\n" +
        ` - row: ${rowNames[pivotRow]}\n` +
        ` - column: ${colNames[pivotCol]}\n` +
        ` - element: ${pivotElement}`,
    );

    console.log();
    console.log("Initially:");
    prettyPrintWith(tableau, rowNames, colNames, eps);

    tableau = crissCrossed(tableau, pivotRow, pivotCol);

    // Change the basis.
    rowNames[pivotCol] = colNames[pivotRow];

    console.log();
    console.log("After iteration:");
    prettyPrintWith(tableau, rowNames, colNames, eps);

    if (tableau[0].filter((it) => it < 0).length === 0) {
      break;
    }
  }

  console.log();
  printHeading("Final Table");
  console.log();
  prettyPrintWith(tableau, rowNames, colNames, eps);

  const answer = tableau[0][tCols - 2];
  const xIndexes = arrayOf(c.length, () => 0);

  rowNames
    .map((rowName, i) => ({ rowName, i }))
    .slice(1)
    .forEach(({ rowName, i }) => {
      if (rowName.startsWith("x")) {
        const numPartStr = rowName.slice(1).slice(1, rowName.length - 2);
        const numPart = Number.parseInt(numPartStr);

        xIndexes[numPart - 1] = tableau[i][tCols - 2];
      }
    });

  const result: SimplexResult = {
    x: xIndexes,
    max: answer,
  };

  console.log();
  console.log(`Decision variables: ${result.x}`);
  console.log(`Maximum value: ${result.max}`);

  return result;
}

function crissCrossed(
  tableau: number[][],
  pivotRow: number,
  pivotCol: number,
): number[][] {
  const newTableau = tableau.map((row) => row.slice());

  for (let i = 0; i < tableau.length; i += 1) {
    for (let j = 0; j < tableau[0].length - 1; j += 1) {
      if (i != pivotRow) {
        newTableau[i][j] =
          tableau[i][j] - tableau[i][pivotCol] * tableau[pivotRow][j];
      }
    }
  }

  return newTableau;
}

function findPivotCol(tableau: number[][], c: number[]): number {
  let pivotColValue = Infinity;
  let pivotCol!: number;

  for (let i = 0; i < tableau.length; i += 1) {
    for (let j = 0; j < c.length; j += 1) {
      if (tableau[i][j] < pivotColValue && j !== 0) {
        pivotColValue = tableau[i][j];
        pivotCol = j;
      }
    }
  }

  return pivotCol;
}

function findPivotRow(tableau: number[][]): number {
  let pivotRowValue = Infinity;
  let pivotRow!: number;

  tableau.forEach((row, i) => {
    if (
      row[tableau[0].length - 1] < pivotRowValue &&
      row[tableau[0].length - 1] > 0
    ) {
      pivotRowValue = row[tableau[0].length - 1];
      pivotRow = i;
    }
  });

  return pivotRow;
}

function assertLengths(c: number[], a: number[][], b: number[]): void | never {
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
