import * as modules from "../module-manager.ts";
import OpenCrypto from "npm:deno-opencrypto";
export function encryption_initialization(public_key: string, data: string) {
  // deno-lint-ignore no-explicit-any
  const crypt = new (OpenCrypto as any as typeof OpenCrypto)();

  crypt
    .getSharedKey(256, {
      cipher: "AES-GCM",
      isExtractable: true,
    })
    .then((aes_key: CryptoKey) => {
      encrypt(aes_key, data, public_key);
    });
}

function encrypt(aes_key: CryptoKey, data: string, public_key: string) {
  // deno-lint-ignore no-explicit-any
  const crypt = new (OpenCrypto as any as typeof OpenCrypto)();
  const data_buffer = crypt.stringToArrayBuffer(data);
  crypt.encrypt(aes_key, data_buffer).then((encrypted_data: string) => {
    crypt.cryptoToBase64(aes_key, "raw").then((base64Key: string) => {
      modules.rsa.encrypt(public_key, base64Key, encrypted_data);
    });
  });
}

export function encrypt_continue(
  encrypted_data_aes: string,
  encrypted_key: string
) {
  const message = encrypted_key + "|" + encrypted_data_aes;
  console.log(message);
}
