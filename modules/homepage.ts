import * as modules from "../module-manager.ts";
import prompts from "npm:prompts";
import opn from "npm:open";

const onCancel = () => {
  console.clear();
  Deno.exit(1);
};
export async function open(private_key: CryptoKey, PublicID: string) {
  modules.logo.print();
  const response = await prompts(
    {
      type: "select",
      name: "value",
      message: "Choose what window to open",
      choices: [
        {
          title: "encrypt",
          description: "encrypt text",
          value: 1,
          disabled: false,
        },
        {
          title: "decrypt",
          description: "decrypt text",
          value: 2,
          disabled: false,
        },
        {
          title: "contacts",
          description: "view and manage your contacts",
          value: 3,
          disabled: false,
        },
        {
          title: "info",
          description: "get information about the app",
          value: 4,
          disabled: false,
        },
        {
          title: "exit",
          description: "exit the application",
          value: 5,
          disabled: false,
        },
      ],
      initial: 0,
    },
    { onCancel }
  );
  switch (response.value) {
    case 1:
      modules.encrypt.start(private_key, PublicID);
      break;
    case 2:
      modules.decrypt.start(private_key, PublicID);
      break;
    case 3:
      contacts(private_key, PublicID);
      break;
    case 4:
      await opn("https://github.com/LioXP/LxCrypt");
      open(private_key, PublicID);
      break;
    case 5:
      console.clear();
      Deno.exit(1);
  }
}

export async function contacts(private_key: CryptoKey, PublicID: string) {
  modules.logo.print();
  const response = await prompts(
    {
      type: "select",
      name: "value",
      message: "Choose what window to open",
      choices: [
        {
          title: "list",
          description: "list all contacts",
          value: 1,
          disabled: false,
        },
        {
          title: "add",
          description: "add a new contact",
          value: 2,
          disabled: false,
        },
        {
          title: "remove",
          description: "remove a contact",
          value: 3,
          disabled: false,
        },
        {
          title: "share",
          description: "share a contact",
          value: 4,
          disabled: false,
        },
        {
          title: "go back",
          description: "Go back",
          value: 5,
          disabled: false,
        },
        {
          title: "exit",
          description: "exit the app",
          value: 6,
          disabled: false,
        },
      ],
      initial: 1,
    },
    { onCancel }
  );
  switch (response.value) {
    case 1:
      modules.contacts.list(private_key, PublicID);
      break;
    case 2:
      {
        const response_name = await prompts(
          {
            type: "text",
            name: "value",
            message:
              'What name should we use for the contact? To go back type "q"',
            validate: (value: string) =>
              value.trim().length < 1
                ? 'The name can\'t be empty! To go back type "q"'
                : true,
          },
          { onCancel }
        );
        if (response_name.value === "q") {
          contacts(private_key, PublicID);
        } else {
          const response_PublicID = await prompts(
            {
              type: "text",
              name: "value",
              message: 'Please paste the full PublicID! To go back type "q"',
              validate: (value: string) =>
                value.trim().length < 1
                  ? 'The PublicID can\'t be empty! To go back type "q"'
                  : true,
            },
            { onCancel }
          );
          if (response_PublicID.value === "q") {
            contacts(private_key, PublicID);
          } else {
            const data = response_PublicID.value.split("|");
            modules.contacts.add(response_name.value, data[0], data[1]);
          }
        }
      }
      break;
    case 3:
      modules.contacts.remove(private_key, PublicID);
      break;
    case 4:
      modules.contacts.share(private_key, PublicID);
      break;
    case 5:
      open(private_key, PublicID);
      break;
    case 6:
      console.clear();
      Deno.exit(1);
  }
}
