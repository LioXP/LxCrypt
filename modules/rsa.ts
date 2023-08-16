import OpenCrypto from "npm:deno-opencrypto";
import os from "node:os";
import path from "node:path";
/* import fs from "node:fs"; */
import ora from "npm:ora";
import process from "node:process";

export function setup(password_hash: string | undefined) {
  // deno-lint-ignore no-explicit-any
  const crypt = new (OpenCrypto as any as typeof OpenCrypto)();

  console.log(password_hash);

  const app_folder = path.join(os.homedir(), "LxCrypt");

  const spinner = ora("Initializing Certificates").start();

  crypt
    .getRSAKeyPair(
      4096,
      "SHA-512",
      "RSA-OAEP",
      ["encrypt", "decrypt", "wrapKey", "unwrapKey"],
      true
    )
    .then((keyPair: CryptoKeyPair) => {
      crypt
        .cryptoPrivateToPem(keyPair.privateKey)
        .then((privatePem: string) => {
          console.log(privatePem);
        });
      crypt.cryptoPublicToPem(keyPair.publicKey).then((publicPem: string) => {
        console.log(publicPem);
        spinner.succeed("Initialization successful");
        process.exit(1);
      });
    });

  /* crypto.generateKeyPair(
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
      if (err) {
        spinner.fail("Error!");
        console.log(err);
        process.exit(1);
      }
      //note .lxcf = LxCrypt File
      fs.writeFileSync(path.join(app_folder, "private_key.lxcf"), private_key);
      fs.writeFileSync(path.join(app_folder, "public_key.lxcf"), public_key);
      spinner.succeed("Initialization successful");
    }
  ); */
}
