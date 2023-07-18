import crypto from "node:crypto";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import ora from "npm:ora";
import { exit } from "node:process";
import process from "node:process";

export function setup(password_hash: string | undefined) {
  console.log(password_hash);
  const app_folder = path.join(os.homedir(), "LxCrypt");

  const spinner = ora("Initializing Certificates").start();

  crypto.generateKeyPair(
    "rsa",
    {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        cipher: "aes-256-cbc",
        passphrase: password_hash,
      },
    },
    (err: Error | null, public_key: string, private_key: string) => {
      if (err !== undefined) {
        spinner.fail("Error!");
      }
      //note .lxcf = LxCrypt File
      fs.writeFileSync(path.join(app_folder, "private_key.lxcf"), private_key);
      fs.writeFileSync(path.join(app_folder, "public_key.lxcf"), public_key);
      spinner.succeed("Initialization successful");
    }
  );
  process.stdin.once("data", function () {
    exit;
  });
}
