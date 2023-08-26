import crypto from "node:crypto";

export function create(input: string) {
  return crypto.createHash("sha512").update(input).digest("hex");
}
