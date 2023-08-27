import * as modules from "../module-manager.ts";
import { Low } from "npm:lowdb";
import { JSONFile } from "npm:lowdb/node";
import prompts from "npm:prompts";

export async function initialize() {
  const adapter = new JSONFile(modules.config.contact_db_path);
  const defaultData = { contacts: [{ name: "You" }] };
  const db = new Low(adapter, defaultData);

  await db.read();
  await db.write();
}

export async function add(name: string, public_id: string, cert_hash: string) {
  await modules.public_key.check(public_id, cert_hash);

  const adapter = new JSONFile(modules.config.contact_db_path);
  const defaultData = "";
  const db = new Low(adapter, defaultData);

  await db.read();
  // deno-lint-ignore no-explicit-any
  const db_data: any = db.data;

  db_data.contacts.push({
    name: name,
    public_id: public_id,
    cert_hash: cert_hash,
  });
  await db.write();
}

export async function list(private_key: CryptoKey, public_id: string) {
  const adapter = new JSONFile(modules.config.contact_db_path);
  const defaultData = "";
  const db = new Low(adapter, defaultData);
  await db.read();
  // deno-lint-ignore no-explicit-any
  const db_data: any = db.data;

  const names = Object.values(db_data.contacts);
  console.log(names);

  const response = await prompts({
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
  });
  if (response.value === 1) {
    modules.homepage.contacts(private_key, public_id);
  } else Deno.exit(1);
}
