import * as modules from "../module-manager.ts";
import { Low } from "npm:lowdb";
import { JSONFile } from "npm:lowdb/node";
import prompts from "npm:prompts";
import { Table } from "npm:console-table-printer";
import fs from "node:fs";

const onCancel = () => {
  console.clear();
  Deno.exit(1);
};
export async function start(private_key: CryptoKey, public_id: string) {
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
        'Please choose who you want to send the message to (use the id). To go back type "q"',
      validate: (value: string) =>
        value.trim().length < 1
          ? 'Please enter something. To go back type "q"'
          : true,
    },
    { onCancel }
  );
  if (response.value === "q") {
    modules.homepage.open(private_key, public_id);
  } else if (response.value === "0") {
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
      modules.homepage.open(private_key, public_id);
    } else {
      modules.aes.encryption_initialization(
        public_key,
        await data.value,
        private_key,
        public_id
      );
    }
  } else {
    if (
      response.value > db_data.contacts.length ||
      response.value < 0 ||
      isNaN(response.value)
    ) {
      start(private_key, public_id);
    } else {
      const public_id_db = db_data.contacts[response.value].public_id;
      const cert_hash = db_data.contacts[response.value].cert_hash;
      const public_key = await modules.public_key.check(
        public_id_db,
        cert_hash
      );
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
        public_id
      );
    }
  }
}
