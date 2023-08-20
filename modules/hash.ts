import crypto from "node:crypto";

export function hash(input: string) {
  return crypto.createHash("sha512").update(input).digest("hex");
}
