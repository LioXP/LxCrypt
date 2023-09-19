import prompts from "npm:prompts";
import * as modules from "../module-manager.ts";

const onCancel = () => {
  console.clear();
  Deno.exit(1);
};
export async function start(private_key: CryptoKey, PublicID: string) {
  const response = await prompts(
    {
      type: "text",
      name: "value",
      message: 'Please enter the encrypted message. To go back type "q"',
      validate: (value: string) =>
        value.trim().length < 1
          ? "The encrypted message is not valid. This message doesn't fit the length criteria of this software."
          : true,
    },
    { onCancel }
  );
  if (response.value === "q") {
    modules.homepage.open(private_key, PublicID);
  } else {
    modules.rsa.decrypt(private_key, response.value.trim(), PublicID);
  }
}
