import { arrayOf, prettyPrintWith } from "./util";

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

  const xStrings = c.map((_, i) => `x[${i + 1}]`);
  const sStrings = a.map((_, i) => `s[${i + 1}]`);

  console.log(`Function: ${xStrings.join(", ")} = ${coeffsToFn(c)}`);

  const rowNames = ["z", ...sStrings];
  const colNames = [...xStrings, ...sStrings, "Solution", "Ratio"];

  const tRows = 1 + a.length;
  const tCols = c.length + a.length + 2;

  let tableau = arrayOf(tRows, () => arrayOf(tCols, () => 0));

  // Z-row
  for (let i = 0; i < c.length; i += 1) {
    tableau[0][i] = -1 * c[i];
  }

  for (let i = 1; i < tRows; i += 1) {
    // X-es
    for (let j = 0; j < c.length; j += 1) {
      tableau[i][j] = a[i - 1][j];
    }

    // S-es
    tableau[i][c.length + i - 1] = 1;

    // Solution row
    tableau[i][tCols - 2] = b[i - 1];
  }

  let counter = 0;
  while (true) {
    console.log();
    console.log(`START OF ITERATION ${counter}`);
    // Find the pivot column.
    let pivotColValue = Infinity;
    let pivotColIndex!: number;

    for (let i = 0; i < tRows; i += 1) {
      for (let j = 0; j < c.length; j += 1) {
        if (tableau[i][j] < pivotColValue && j !== 0) {
          pivotColValue = tableau[i][j];
          pivotColIndex = j;
        }
      }
    }

    // Compute the ratio.
    for (let i = 0; i < tRows; i += 1) {
      tableau[i][tCols - 1] = tableau[i][tCols - 2] / tableau[i][pivotColIndex];
    }

    // Find the pivot row.
    let pivotRowValue = Infinity;
    let pivotRowIndex!: number;

    tableau.forEach((row, i) => {
      if (row[tCols - 1] < pivotRowValue && row[tCols - 1] > 0) {
        pivotRowValue = row[tCols - 1];
        pivotRowIndex = i;
      }
    });

    // Find the pivot element.
    const pivotElement = tableau[pivotRowIndex][pivotColIndex];

    // Divide the pivot row by the pivot element.
    for (let j = 0; j < tCols - 1; j += 1) {
      tableau[pivotRowIndex][j] /= pivotElement;
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
    prettyPrintWith(tableau, rowNames, colNames, eps);

    // Set the pivot column to zeros.
    const tableTmp = tableau.map((row) => row.slice());

    for (let i = 0; i < tRows; i += 1) {
      for (let j = 0; j < tCols - 1; j += 1) {
        if (i != pivotRowIndex) {
          tableTmp[i][j] =
            tableau[i][j] -
            tableau[i][pivotColIndex] * tableau[pivotRowIndex][j];
        }
      }
    }
    tableau = tableTmp;

    // Change the basis.
    rowNames[pivotColIndex] = colNames[pivotRowIndex];
    console.log();
    console.log("TABLE AFTER ITERATION:");
    prettyPrintWith(tableau, rowNames, colNames, eps);

    if (tableau[0].filter((it) => it < 0).length === 0) {
      break;
    }

    console.log();
    console.log(`END OF ITERATION ${counter}`);
    counter += 1;
  }

  console.log();
  console.log("Final table:");
  prettyPrintWith(tableau, rowNames, colNames, eps);

  const answer = tableau[0][tCols - 2];
  const xIndexes = arrayOf(c.length, () => 0);
  console.log(rowNames);

  for (let i = 1; i < rowNames.length; i += 1) {
    if (rowNames[i].startsWith("x")) {
      xIndexes[
        Number.parseInt(rowNames[i].slice(2, rowNames[i].length - 1)) - 1
      ] = tableau[i][c.length + a.length];
    }
  }

  console.log(answer);
  console.log(xIndexes);

  return {
    x: xIndexes,
    max: answer,
  };
}

function coeffsToFn(coeffs: number[]): string {
  return coeffs.map((it, i) => `${it}*x[${i + 1}]`).join(" + ");
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
