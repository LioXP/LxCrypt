import * as modules from "../module-manager.ts";
import { Low } from "npm:lowdb";
import { JSONFile } from "npm:lowdb/node";
import prompts from "npm:prompts";
import { Table } from "npm:console-table-printer";
import fs from "node:fs";
import chalk from "npm:chalk";
import pressAnyKey from "npm:press-any-key";

const onCancel = () => {
  console.clear();
  Deno.exit(1);
};

export async function initialize() {
  const adapter = new JSONFile(modules.config.contact_db_path);
  const defaultData = { contacts: [{ name: "You" }] };
  const db = new Low(adapter, defaultData);

  await db.read();
  await db.write();
}

export async function add(
  name: string,
  PublicID: string,
  cert_hash: string,
  private_key: CryptoKey,
  ownPublicID: string
) {
  const contact_check_response = await modules.public_key.check(
    PublicID,
    cert_hash
  );

  if (contact_check_response === 1) {
    modules.logo.print();
    console.log(chalk.red("The PublicID you provided was invalid!\n\n"));
    await pressAnyKey("Press any key to go back...").then(() => {
      modules.homepage.contacts(private_key, ownPublicID);
    });
  } else {
    const adapter = new JSONFile(modules.config.contact_db_path);
    const defaultData = "";
    const db = new Low(adapter, defaultData);

    await db.read();
    // deno-lint-ignore no-explicit-any
    const db_data: any = db.data;

    db_data.contacts.push({
      name: name,
      PublicID: PublicID,
      cert_hash: cert_hash,
    });
    await db.write();
    modules.logo.print();
    console.log(
      chalk.green("\nYou successfully added " + name + " to your contacts!\n\n")
    );
    pressAnyKey("Press any key to go back to the menu...").then(() => {
      modules.homepage.contacts(private_key, PublicID);
    });
  }
}

export async function list(private_key: CryptoKey, PublicID: string) {
  modules.logo.print();
  const adapter = new JSONFile(modules.config.contact_db_path);
  const defaultData = "";
  const db = new Low(adapter, defaultData);
  await db.read();
  // deno-lint-ignore no-explicit-any
  const db_data: any = db.data;

  const t = new Table({
    title: "Contacts",
    columns: [
      { name: "id", alignment: "left" },
      { name: "name", alignment: "left" },
    ],
  });

  for (let i = 0; i < db_data.contacts.length; i++) {
    const obj = db_data.contacts[i];
    t.addRow({ id: i, name: obj.name });
  }

  t.printTable();
  const response = await prompts(
    {
      type: "select",
      name: "value",
      message: "What do you want to do now?",
      choices: [
        {
          title: "Go back",
          description: "Go back",
          value: 1,
        },
        {
          title: "exit",
          description: "Exit the application",
          value: 2,
        },
      ],
      initial: 0,
    },
    { onCancel }
  );
  if (response.value === 1) {
    modules.homepage.contacts(private_key, PublicID);
  } else Deno.exit(1);
}

export async function remove(private_key: CryptoKey, PublicID: string) {
  modules.logo.print();
  const adapter = new JSONFile(modules.config.contact_db_path);
  const defaultData = "";
  const db = new Low(adapter, defaultData);
  await db.read();
  // deno-lint-ignore no-explicit-any
  const db_data: any = db.data;

  if (db_data.contacts.length === 1) {
    modules.logo.print();
    console.log(chalk.red("You don't have any contacts (to delete)!\n\n"));
    await pressAnyKey("Press any key to go back...").then(() => {
      modules.homepage.contacts(private_key, PublicID);
    });
  } else {
    const t = new Table({
      title: "Contacts",
      columns: [
        { name: "id", alignment: "left" },
        { name: "name", alignment: "left" },
      ],
    });

    for (let i = 1; i < db_data.contacts.length; i++) {
      const obj = db_data.contacts[i];
      t.addRow({ id: i, name: obj.name });
    }

    t.printTable();
    const response = await prompts(
      {
        type: "text",
        name: "value",
        message:
          'Please choose what contact you want to delete. To go back type "q"',
        validate: (value: string) =>
          value.trim().length < 1
            ? 'Please choose a contact or go back. To go back type "q"'
            : true,
      },
      { onCancel }
    );
    const response_value = response.value.trim().replace(/^0+/, "");
    if (response_value === "q") {
      modules.homepage.contacts(private_key, PublicID);
    } else {
      if (
        response_value > db_data.contacts.length - 1 ||
        response_value < 1 ||
        isNaN(response_value)
      ) {
        remove(private_key, PublicID);
      } else {
        const contact_name = db_data.contacts[response_value].name;
        const confirm = await prompts(
          {
            type: "confirm",
            name: "value",
            message:
              'Are you sure you want to delete the contact called "' +
              contact_name +
              '"',
            initial: false,
          },
          { onCancel }
        );
        if (confirm.value === true) {
          db_data.contacts.splice(response.value.trim(), 1);
          await db.write();
          modules.logo.print();
          console.log(
            chalk.green(
              "\nYou successfully removed " +
                contact_name +
                " from your contacts!\n\n"
            )
          );
          pressAnyKey("Press any key to go back to the menu...").then(() => {
            modules.homepage.contacts(private_key, PublicID);
          });
        } else {
          modules.homepage.contacts(private_key, PublicID);
        }
      }
    }
  }
}

export async function share(private_key: CryptoKey, PublicID: string) {
  modules.logo.print();
  const adapter = new JSONFile(modules.config.contact_db_path);
  const defaultData = "";
  const db = new Low(adapter, defaultData);
  await db.read();
  // deno-lint-ignore no-explicit-any
  const db_data: any = db.data;

  const t = new Table({
    title: "Contacts",
    columns: [
      { name: "id", alignment: "left" },
      { name: "name", alignment: "left" },
    ],
  });

  for (let i = 0; i < db_data.contacts.length; i++) {
    const obj = db_data.contacts[i];
    t.addRow({ id: i, name: obj.name });
  }

  t.printTable();
  const response = await prompts(
    {
      type: "text",
      name: "value",
      message:
        'Please choose what contact you want to share. To go back type "q"',
      validate: (value: string) =>
        value.trim().length < 1
          ? 'Please choose a contact or go back. To go back type "q"'
          : true,
    },
    { onCancel }
  );
  const response_value = response.value.trim().replace(/^0+/, "");
  if (response_value === "q") {
    modules.homepage.contacts(private_key, PublicID);
  } else if (response_value === "") {
    const PublicID = fs.readFileSync(modules.config.PublicID_path).toString();
    modules.logo.print();
    console.log(chalk.green("This is your PublicID:"));
    console.log("\n\n" + PublicID + "\n\n");
    pressAnyKey("Press any key to go back...").then(() => {
      modules.homepage.contacts(private_key, PublicID);
    });
  } else {
    if (
      response_value > db_data.contacts.length ||
      response_value < 0 ||
      isNaN(response_value)
    ) {
      share(private_key, PublicID);
    } else {
      modules.logo.print();
      console.log(
        chalk.green(
          "This is " + db_data.contacts[response_value].name + "'s PublicID:"
        )
      );
      console.log(
        "\n\n" +
          db_data.contacts[response_value].PublicID +
          "|" +
          db_data.contacts[response_value].cert_hash +
          "\n\n"
      );
      pressAnyKey("Press any key to go back...").then(() => {
        modules.homepage.contacts(private_key, PublicID);
      });
    }
  }
}

export async function CheckForDuplicates(name: string, cert_hash: string) {
  modules.logo.print();
  const adapter = new JSONFile(modules.config.contact_db_path);
  const defaultData = "";
  const db = new Low(adapter, defaultData);
  await db.read();
  // deno-lint-ignore no-explicit-any
  const db_data: any = db.data;

  for (let i = 0; i < db_data.contacts.length; i++) {
    const obj = db_data.contacts[i];
    if (name === obj.name) {
      return 1;
    }
    if (cert_hash === obj.cert_hash) {
      return obj.name;
    }
  }
  return 0;
}
