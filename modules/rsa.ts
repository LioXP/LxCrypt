import OpenCrypto from "npm:opencrypto";
import os from "node:os";
import path from "node:path";
/* import fs from "node:fs"; */
import ora from "npm:ora";
/* import process from "node:process"; */

export function setup(password_hash: string | undefined) {
  // deno-lint-ignore no-explicit-any
  const crypt = new (OpenCrypto as any as (typeof OpenCrypto)["default"])();

  console.log(password_hash);

  const app_folder = path.join(os.homedir(), "LxCrypt");

  const spinner = ora("Initializing Certificates").start();

  const usage = ["encrypt", "decrypt", "wrapKey", "unwrapKey"];
  crypt
    .getRSAKeyPair("4096", "SHA-512", "RSA-OAEP", usage, true)
    // deno-lint-ignore no-explicit-any
    .then((keyPair: any) => {
      console.log(keyPair.publicKey);
      console.log(keyPair.privateKey);
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
