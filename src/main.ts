function main(): void {
  console.log("Hello via Bun!");
}

if (import.meta.main) {
  main();
}
