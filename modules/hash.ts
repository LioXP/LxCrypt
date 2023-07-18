import crypto from "node:crypto";

export function hash(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}
