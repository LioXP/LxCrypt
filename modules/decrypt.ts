import prompts from "npm:prompts";
import * as modules from "../module-manager.ts";

export async function start(private_key: CryptoKey, public_id: string) {
  const response = await prompts({
    type: "text",
    name: "value",
    message: "Please enter the encrypted message. To go back enter x",
  });
  if (response.value === "x") {
    modules.homepage.open(private_key, public_id);
  } else {
    modules.rsa.decrypt(private_key, response.value);
  }
}
