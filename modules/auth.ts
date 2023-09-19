import * as modules from "../module-manager.ts";
import prompts from "npm:prompts";
import chalk from "npm:chalk";
import process from "node:process";
import fs from "node:fs";
import OpenCrypto from "npm:deno-opencrypto";
import pressAnyKey from "npm:press-any-key";

const onCancel = () => {
  console.clear();
  Deno.exit(1);
};

export async function setup() {
  const password = await prompts(
    {
      type: "password",
      name: "input",
      message: "Please enter a password",
      validate: (value: string) =>
        value.trim().length < 2
          ? "The password is too short. Please use at least 2 characters!"
          : true,
    },
    { onCancel }
  );

  const password_confirmation = await prompts(
    {
      type: "password",
      name: "input",
      message: "Please confirm your password",
      validate: (value: string) =>
        value.trim().length < 2
          ? "The password is too short. Please use at least 2 characters!"
          : true,
    },
    { onCancel }
  );
  if (password.input === password_confirmation.input) {
    const confirmation = await prompts(
      {
        type: "confirm",
        name: "value",
        message:
          "Are you sure? We are not able to restore access to your account without this password",
        initial: false,
      },
      { onCancel }
    );
    if (confirmation.value === true) {
      const password_hash = modules.hash.create(password.input);
      return password_hash;
    } else {
      console.log(chalk.red('\nYou picked "no"\n'));
      await pressAnyKey("Press any key to exit...").then(() => {
        Deno.exit(1);
      });
    }
  } else {
    console.log(chalk.red("\nPasswords don't match!\n"));
    await pressAnyKey("Press any key to exit...").then(() => {
      Deno.exit(1);
    });
    process.stdin.once("data", function () {
      modules.setup.start();
    });
  }
  return "";
}
export async function login() {
  // deno-lint-ignore no-explicit-any
  const crypt = new (OpenCrypto as any as typeof OpenCrypto)();

  await modules.hashfile.check();

  const password = await prompts(
    {
      type: "password",
      name: "input",
      message: "Please enter your password",
      validate: (value: string) =>
        value.trim().length < 2
          ? "The password is too short. The password is at least 2 characters long!"
          : true,
    },
    { onCancel }
  );

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
      modules.homepage.open(private_key, public_id.toString());
    })
    .catch(async () => {
      modules.logo.print();
      console.log(chalk.red("The Password you provided was invalid!\n\n"));
      await pressAnyKey("Press any key to exit...").then(() => {
        Deno.exit(1);
      });
    });
}
