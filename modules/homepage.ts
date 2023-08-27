import * as modules from "../module-manager.ts";
import prompts from "npm:prompts";
export async function initialize(private_key: CryptoKey, public_id: string) {
  modules.logo.print();
  const response = await prompts({
    type: "select",
    name: "value",
    message: "Choose what window to open",
    choices: [
      {
        title: "encrypt",
        description: "encrypt text",
        value: "1",
        disabled: true,
      },
      {
        title: "decrypt",
        description: "decrypt text",
        value: "2",
        disabled: true,
      },
      {
        title: "contacts",
        description: "view and manage your contacts",
        value: "3",
      },
      {
        title: "info",
        description: "get information about the app",
        value: "4",
        disabled: true,
      },
    ],
    initial: 2,
  });
  switch (response.value) {
    case 1:
      console.log("1");
      break;
    case 2:
      console.log("2");
      break;
    case 3:
      console.log("3");
      break;
    case 4:
      console.log("4");
      break;
  }
}
