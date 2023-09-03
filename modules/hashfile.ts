import * as modules from "../module-manager.ts";
import fs from "node:fs";
import pressAnyKey from "npm:press-any-key";

export function create() {
  const private_key_file = fs.readFileSync(modules.config.private_key_path);
  const private_key_hash = modules.hash.create(private_key_file.toString());

  const public_key_file = fs.readFileSync(modules.config.public_key_path);
  const public_key_hash = modules.hash.create(public_key_file.toString());

  const public_id_file = fs.readFileSync(modules.config.public_id_path);
  const public_id_hash = modules.hash.create(public_id_file.toString());

  const data = {
    private_key_hash: private_key_hash,
    public_key_hash: public_key_hash,
    public_id_hash: public_id_hash,
  };

  fs.writeFileSync(modules.config.hashfile_path, JSON.stringify(data));
}
export async function check() {
  try {
    const private_key_file = fs.readFileSync(modules.config.private_key_path);
    const private_key_hash = modules.hash.create(private_key_file.toString());

    const public_key_file = fs.readFileSync(modules.config.public_key_path);
    const public_key_hash = modules.hash.create(public_key_file.toString());

    const public_id_file = fs.readFileSync(modules.config.public_id_path);
    const public_id_hash = modules.hash.create(public_id_file.toString());

    const hashfile = JSON.parse(
      fs.readFileSync(modules.config.hashfile_path).toString()
    );

    if (
      private_key_hash !== hashfile.private_key_hash ||
      public_key_hash !== hashfile.public_key_hash ||
      public_id_hash !== hashfile.public_id_hash
    ) {
      console.log("Hash failed!");
      Deno.exit(1);
    }
  } catch {
    fs.rmSync(modules.config.app_folder, {
      recursive: true,
      force: true,
    });
    console.log(
      "You didn't finish the setup process last time. The application just performed a reset."
    );
    await pressAnyKey("Press any key to exit...").then(() => {
      Deno.exit(1);
    });
  }
}
