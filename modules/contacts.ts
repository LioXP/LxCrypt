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

export async function initialize() {
  const adapter = new JSONFile(modules.config.contact_db_path);
  const defaultData = { contacts: [{ name: "You" }] };
  const db = new Low(adapter, defaultData);

  await db.read();
  await db.write();
}

export async function add(name: string, PublicID: string, cert_hash: string) {
  await modules.public_key.check(PublicID, cert_hash);

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
          description: "exit the application",
          value: 2,
        },
      ],
      initial: 1,
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
    Deno.exit(1);
  }
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
    },
    { onCancel }
  );

  if (response.value !== "q") {
    const confirm = await prompts(
      {
        type: "confirm",
        name: "value",
        message:
          'Are you sure you want to delete the contact called "' +
          db_data.contacts[response.value].name +
          '"',
        initial: false,
      },
      { onCancel }
    );
    if (confirm.value === true) {
      db_data.contacts.splice(response.value, 1);
      await db.write();
    } else {
      modules.homepage.contacts(private_key, PublicID);
    }
  } else {
    modules.homepage.contacts(private_key, PublicID);
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
    },
    { onCancel }
  );
  if (response.value === "q") {
    modules.homepage.contacts(private_key, PublicID);
  } else if (response.value === "0") {
    const PublicID = fs.readFileSync(modules.config.PublicID_path).toString();
    console.log(PublicID);
  } else {
    console.log(
      db_data.contacts[response.value].name +
        "'s public-id: " +
        db_data.contacts[response.value].PublicID +
        "|" +
        db_data.contacts[response.value].cert_hash
    );
  }
}
