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
export async function start(private_key: CryptoKey, PublicID: string) {
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
        'Please choose who you want to send the message to. Please use the id\'s. To go back type "q"',
      validate: (value: string) =>
        value.trim().length < 1
          ? 'Please enter something. To go back type "q"'
          : true,
    },
    { onCancel }
  );
  const response_value = response.value.trim().replace(/^0+/, "");
  if (response_value === "q") {
    modules.homepage.open(private_key, PublicID);
  } else if (response_value === "") {
    const public_key = fs
      .readFileSync(modules.config.public_key_path)
      .toString();
    const data = await prompts(
      {
        type: "text",
        name: "value",
        message: 'Please enter your message. To go back type "q"',
        validate: (value: string) =>
          value.trim().length === 0 ? "The message can't be empty!" : true,
      },
      { onCancel }
    );
    if (data.value === "q") {
      modules.homepage.open(private_key, PublicID);
    } else {
      modules.aes.encryption_initialization(
        public_key,
        await data.value,
        private_key,
        PublicID
      );
    }
  } else {
    if (
      response_value > db_data.contacts.length ||
      response_value < 0 ||
      isNaN(response_value)
    ) {
      start(private_key, PublicID);
    } else {
      const PublicID_db = db_data.contacts[response_value].PublicID;
      const cert_hash = db_data.contacts[response_value].cert_hash;
      const public_key = await modules.public_key.check(PublicID_db, cert_hash);
      if (public_key === 1) {
        modules.logo.print();
        console.log(
          chalk.red(
            "The PublicID seems to be invalid. Please try again! If this error persists, delete the contact, and add them again!\n\n"
          )
        );
        await pressAnyKey("Press any key to go back...").then(() => {
          modules.homepage.open(private_key, PublicID);
        });
      } else {
        const data = await prompts(
          {
            type: "text",
            name: "value",
            message: "Please enter your message",
            validate: (value: string) =>
              value.trim().length === 0 ? "The message can't be empty!" : true,
          },
          { onCancel }
        );
        modules.aes.encryption_initialization(
          public_key,
          await data.value,
          private_key,
          PublicID_db
        );
      }
    }
  }
}
