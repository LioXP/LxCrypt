import * as modules from "../module-manager.ts";
import prompts from "npm:prompts";
import chalk from "npm:chalk";
import process from "node:process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import OpenCrypto from "npm:deno-opencrypto@2.1.0";

export async function setup() {
  //todo explain
  const password = await prompts({
    type: "password",
    name: "input",
    message: "Please enter a password",
  });
  const password_confirmation = await prompts({
    type: "password",
    name: "input",
    message: "Please confirm your password",
  });
  if (password.input === password_confirmation.input) {
    const confirmation = await prompts({
      type: "confirm",
      name: "value",
      message:
        "Are you sure? We are not able to restore access to your account without this password",
      initial: false,
    });
    if (confirmation.value === true) {
      const password_hash = modules.hash.hash(password.input);
      return password_hash;
    } else {
      //todo explain
      console.log('You picked "no". Press any key to retry');
      process.stdin.once("data", function () {
        modules.setup.start();
      });
    }
  } else {
    console.log(chalk.red("Passwords don't match!\n"));
    console.log(chalk.red("Press any key to retry\n"));
    process.stdin.once("data", function () {
      modules.setup.start();
    });
  }
  return "";
}
export async function login() {
  // deno-lint-ignore no-explicit-any
  const crypt = new (OpenCrypto as any as typeof OpenCrypto)();

  const app_folder = path.join(os.homedir(), "LxCrypt");

  const password = await prompts({
    type: "password",
    name: "input",
    message: "Please enter your password",
  });

  const private_key_file = fs.readFileSync(
    path.join(app_folder, "private_key.lxcf")
  );

  crypt
    .decryptPrivateKey(
      private_key_file.toString(),
      modules.hash.hash(password.input),
      {
        name: "RSA-OAEP",
        hash: { name: "SHA-512" },
        usages: ["decrypt", "unwrapKey"],
        isExtractable: true,
      }
    )
    .then((private_key: CryptoKey) => {
      console.log(private_key);
    });
}
