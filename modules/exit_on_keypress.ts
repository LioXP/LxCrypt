import process from "node:process";
export function wait() {
  console.log("Press any key to exit...");

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("data", Deno.exit(1));
}
