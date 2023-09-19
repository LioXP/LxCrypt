import chalk from "npm:chalk";
import * as modules from "../module-manager.ts";
import OpenCrypto from "npm:deno-opencrypto";
import pressAnyKey from "npm:press-any-key";
export function encryption_initialization(
  public_key: string,
  data: string,
  private_key: CryptoKey,
  public_id: string
) {
  // deno-lint-ignore no-explicit-any
  const crypt = new (OpenCrypto as any as typeof OpenCrypto)();

  crypt
    .getSharedKey(256, {
      cipher: "AES-GCM",
      isExtractable: true,
    })
    .then((aes_key: CryptoKey) => {
      encrypt(aes_key, data, public_key, private_key, public_id);
    });
}

function encrypt(
  aes_key: CryptoKey,
  data: string,
  public_key: string,
  private_key: CryptoKey,
  public_id: string
) {
  // deno-lint-ignore no-explicit-any
  const crypt = new (OpenCrypto as any as typeof OpenCrypto)();
  const data_buffer = crypt.stringToArrayBuffer(data);
  crypt.encrypt(aes_key, data_buffer).then((encrypted_data: string) => {
    crypt.cryptoToBase64(aes_key, "raw").then((base64Key: string) => {
      modules.rsa.encrypt(
        public_key,
        base64Key,
        encrypted_data,
        private_key,
        public_id
      );
    });
  });
}

export function encrypt_continue(
  encrypted_data_aes: string,
  encrypted_key: string,
  private_key: CryptoKey,
  public_id: string
) {
  const message = encrypted_key + "|" + encrypted_data_aes;

  modules.logo.print();
  console.log(
    chalk.green(
      "The message was successfully encrypted. You can copy it by selecting, and right clicking in the Terminal"
    )
  );
  console.log("\n\n" + message + "\n\n");
  pressAnyKey("Press any key to go back to the menu...").then(() => {
    modules.homepage.open(private_key, public_id);
  });
}

export async function decrypt(
  aes_key: string,
  encrypted_data: string,
  private_key: CryptoKey,
  public_id: string
) {
  try {
    // deno-lint-ignore no-explicit-any
    const crypt = new (OpenCrypto as any as typeof OpenCrypto)();
    crypt
      .base64ToCrypto(aes_key, {
        name: "AES-GCM",
        length: 256,
        usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"],
        isExtractable: false,
      })
      .then((aes_CryptoKey: CryptoKey) => {
        decrypt_continue(aes_CryptoKey, encrypted_data, private_key, public_id);
      });
  } catch {
    modules.logo.print();
    console.log(chalk.red("The message you provided was invalid!\n\n"));
    await pressAnyKey("Press any key to go back to the menu...").then(() => {
      modules.homepage.open(private_key, public_id);
    });
  }
}

function decrypt_continue(
  aes_CryptoKey: CryptoKey,
  encrypted_data: string,
  private_key: CryptoKey,
  public_id: string
) {
  // deno-lint-ignore no-explicit-any
  const crypt = new (OpenCrypto as any as typeof OpenCrypto)();
  crypt
    .decrypt(aes_CryptoKey, encrypted_data, { cipher: "AES-GCM" })
    .then((decrypted_data_buffer: ArrayBufferLike) => {
      const decrypted_data = crypt.arrayBufferToString(decrypted_data_buffer);
      modules.logo.print();
      console.log(chalk.green("The message was successfully decrypted."));
      console.log("\n\n" + decrypted_data + "\n\n");
      pressAnyKey("Press any key to go back to the menu...").then(() => {
        modules.homepage.open(private_key, public_id);
      });
    })
    .catch(async () => {
      modules.logo.print();
      console.log(chalk.red("The message you provided was invalid!\n\n"));
      await pressAnyKey("Press any key to go back to the menu...").then(() => {
        modules.homepage.open(private_key, public_id);
      });
    });
}
