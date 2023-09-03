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
      modules.config.rsa_key_size,
      modules.config.rsa_key_hash,
      modules.config.rsa_key_format,
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
          modules.config.rsa_key_hash,
          modules.config.private_key_aes_type,
          modules.config.private_key_aes_length
        )
        .then(async (encryptedPrivateKey: string) => {
          //note .lxcf = LxCrypt File
          fs.writeFileSync(
            modules.config.private_key_path,
            encryptedPrivateKey
          );
          await modules.public_key.share();
          modules.hashfile.create();
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

export function encrypt(public_key_pem: string, data: string) {
  // deno-lint-ignore no-explicit-any
  const crypt = new (OpenCrypto as any as typeof OpenCrypto)();
  crypt
    .pemPublicToCrypto(public_key_pem, {
      name: modules.config.rsa_key_format,
      hash: modules.config.rsa_key_hash,
      usages: ["encrypt", "wrapKey"],
      isExtractable: false,
    })
    .then((public_key: CryptoKey) => {
      const input = crypt.stringToArrayBuffer(data);
      crypt.rsaEncrypt(public_key, input).then((encrypted_data: string) => {
        console.log(encrypted_data);
      });
    });
}
