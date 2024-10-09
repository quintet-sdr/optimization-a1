export function arrayOf<T>(n: number, item: () => T): T[] {
  return new Array(n).fill(undefined).map(item);
}

export function prettyPrintWith(
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
