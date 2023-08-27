import * as modules from "../module-manager.ts";
import { Low } from "npm:lowdb";
import { JSONFile } from "npm:lowdb/node";

export async function initialize() {
  const adapter = new JSONFile(modules.config.contact_db_path);
  const defaultData = { contacts: [{ id: 0, name: "You" }] };
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

  const contact_id: number =
    db_data.contacts[db_data.contacts.length - 1].id + 1;

  db_data.contacts.push({
    id: contact_id,
    name: name,
    public_id: public_id,
    cert_hash: cert_hash,
  });
  await db.write();
}
