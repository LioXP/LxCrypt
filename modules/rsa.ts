import OpenCrypto from "npm:deno-opencrypto@2.1.0";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import ora from "npm:ora";
import chalk from "npm:chalk";

export function setup(password_hash: string) {
  // deno-lint-ignore no-explicit-any
  const crypt = new (OpenCrypto as any as typeof OpenCrypto)();

  const app_folder = path.join(os.homedir(), "LxCrypt");

  const spinner = ora(
    "Initializing Certificates. This might take a while depending on your CPU!"
  ).start();

  crypt
    .getRSAKeyPair(
      /* 7680, */
      4096,
      "SHA-512",
      "RSA-OAEP",
      ["encrypt", "decrypt", "wrapKey", "unwrapKey"],
      true
    )
    .then((keyPair: CryptoKeyPair) => {
      crypt.cryptoPublicToPem(keyPair.publicKey).then((publicPem: string) => {
        fs.writeFileSync(path.join(app_folder, "public_key.lxcf"), publicPem);
      });
      crypt
        .encryptPrivateKey(
          keyPair.privateKey,
          password_hash,
          64000,
          "SHA-512",
          "AES-GCM",
          256
        )
        .then((encryptedPrivateKey: string) => {
          //note .lxcf = LxCrypt File
          fs.writeFileSync(
            path.join(app_folder, "private_key.lxcf"),
            encryptedPrivateKey
          );
          spinner.succeed(chalk.green.bold("Initialization successful\n"));
          console.log(
            chalk.blue.bold(
              "\nThe Setup is complete. Please reopen the Application now.\n\n"
            )
          );
          Deno.exit(0);
        });
    });
}
