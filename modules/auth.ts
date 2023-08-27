import * as modules from "../module-manager.ts";
import prompts from "npm:prompts";
import chalk from "npm:chalk";
import process from "node:process";
import fs from "node:fs";
import OpenCrypto from "npm:deno-opencrypto";

export async function setup() {
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
      const password_hash = modules.hash.create(password.input);
      return password_hash;
    } else {
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

  modules.hashfile.check();

  const password = await prompts({
    type: "password",
    name: "input",
    message: "Please enter your password",
  });

  const private_key_file = fs.readFileSync(modules.config.private_key_path);

  crypt
    .decryptPrivateKey(
      private_key_file.toString(),
      modules.hash.create(password.input),
      {
        name: "RSA-OAEP",
        hash: "SHA-512",
        usages: ["decrypt", "unwrapKey"],
        isExtractable: false,
      }
    )
    .then((private_key: CryptoKey) => {
      const public_id = fs.readFileSync(modules.config.public_id_path);
      modules.homepage.initialize(private_key, public_id.toString());
    });
}
