import * as modules from "../module-manager.ts";
import OpenCrypto from "npm:deno-opencrypto";
import fs from "node:fs";
import ora from "npm:ora";
import chalk from "npm:chalk";

export function setup(password_hash: string) {
  // deno-lint-ignore no-explicit-any
  const crypt = new (OpenCrypto as any as typeof OpenCrypto)();

  const spinner = ora(
    "Initializing Certificates. This might take a while depending on your CPU!"
  ).start();

  crypt
    .getRSAKeyPair(
      7680,
      "SHA-512",
      "RSA-OAEP",
      ["encrypt", "decrypt", "wrapKey", "unwrapKey"],
      true
    )
    .then((keyPair: CryptoKeyPair) => {
      crypt.cryptoPublicToPem(keyPair.publicKey).then((publicPem: string) => {
        fs.writeFileSync(modules.config.public_key_path, publicPem);
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
            modules.config.private_key_path,
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
