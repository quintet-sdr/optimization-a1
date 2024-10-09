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
    ...tableau.map((row, j) => [
      rowNames[j],
      ...row.map((num) => num.toFixed(precision)),
    ]),
  ]);
}

export function printHeading(text: string): void {
  const lines = new Array(24).fill("-").join("");
  console.log("\n" + `${lines}[ ${text} ]${lines}` + "\n");
}

function prettyPrint(tableau: string[][]) {
  let colMaxes = [];
  for (let j = 0; j < tableau[0].length; j += 1) {
    colMaxes.push(
      Math.max.apply(
        null,
        tableau.map((row) => row[j]).map((n) => n.length),
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
