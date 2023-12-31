import * as modules from "../module-manager.ts";
import prompts from "npm:prompts";
import opn from "npm:open";
import pressAnyKey from "npm:press-any-key";
import chalk from "npm:chalk";

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
      message: "Choose action",
      choices: [
        {
          title: "encrypt",
          description: "Use this to encrypt text",
          value: 1,
          disabled: false,
        },
        {
          title: "decrypt",
          description: "Use this to decrypt text",
          value: 2,
          disabled: false,
        },
        {
          title: "contacts",
          description: "Use this to open the contacts menu",
          value: 3,
          disabled: false,
        },
        {
          title: "info",
          description: "Use this to open the Project website",
          value: 4,
          disabled: false,
        },
        {
          title: "exit",
          description: "Use this to exit the application",
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
      message: "Choose what you want to do",
      choices: [
        {
          title: "list",
          description: "Use this to list all your existing contacts",
          value: 1,
          disabled: false,
        },
        {
          title: "add",
          description: "Use this to add a new contact to your database",
          value: 2,
          disabled: false,
        },
        {
          title: "remove",
          description: "Use this to remove a contact from your database",
          value: 3,
          disabled: false,
        },
        {
          title: "share",
          description: "Use this to share/export a contact",
          value: 4,
          disabled: false,
        },
        {
          title: "go back",
          description: "Use this to go back to the homepage",
          value: 5,
          disabled: false,
        },
        {
          title: "exit",
          description: "Use this to exit the application",
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
            const DuplicatesCheckResponse =
              await modules.contacts.CheckForDuplicates(
                response_name.value.trim(),
                data[1]
              );
            if (DuplicatesCheckResponse === 0) {
              const data = response_PublicID.value.split("|");
              modules.contacts.add(
                response_name.value,
                data[0],
                data[1],
                private_key,
                PublicID
              );
            } else if (DuplicatesCheckResponse === 1) {
              modules.logo.print();
              console.log(
                chalk.red(
                  "You already have a contact with the same name! (" +
                    response_name.value +
                    ")\n"
                )
              );
              await pressAnyKey("Press any key to go back...").then(() => {
                modules.homepage.contacts(private_key, PublicID);
              });
            } else {
              modules.logo.print();
              console.log(
                chalk.red(
                  "You already have a contact with the same PublicID!\n"
                )
              );
              console.log(
                "The contact with the same PublicID is " +
                  DuplicatesCheckResponse +
                  "\n\n"
              );
              await pressAnyKey("Press any key to go back...").then(() => {
                modules.homepage.contacts(private_key, PublicID);
              });
            }
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
