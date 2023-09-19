import * as modules from "../module-manager.ts";
import chalk from "npm:chalk";
import pressAnyKey from "npm:press-any-key";
import fs from "node:fs";

export async function share() {
  const public_key_file = fs.readFileSync(modules.config.public_key_path);
  await setup_share(public_key_file.toString());
}
async function setup_share(publicPem: string) {
  const public_key = encodeURIComponent(publicPem);
  const body = `content=${public_key}&expiry_days=365`;
  const req = await fetch(modules.config.paste_api, {
    method: "POST",
    headers: {
      "User-Agent": modules.config.user_agent,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (req.status === 201) {
    const key = (await req.text())
      .replace(modules.config.paste_prefix, "")
      .replace(/\s/g, "");
    const web_key = await fetch(
      modules.config.paste_prefix + key + modules.config.raw_paste_suffix
    );
    const web_key_raw = await web_key.text();
    const hash = modules.hash.create(web_key_raw.replace(/\s/g, ""));
    const id = key + "|" + hash;
    fs.writeFileSync(modules.config.PublicID_path, id);
  } else {
    console.log("Error!");
    Deno.exit(1);
  }
}

export async function check(
  PublicID: string,
  cert_hash: string,
  private_key: CryptoKey,
  ownPublicID: string
) {
  const web_key = await fetch(
    modules.config.paste_prefix + PublicID + modules.config.raw_paste_suffix
  );
  const web_key_raw = await web_key.text();
  const hash = modules.hash.create(web_key_raw.replace(/\s/g, ""));

  if (hash !== cert_hash) {
    modules.logo.print();
    console.log(chalk.red("The PublicID you provided was invalid!\n\n"));
    await pressAnyKey("Press any key to go back...").then(() => {
      modules.homepage.contacts(private_key, ownPublicID);
    });
    return "";
  } else return web_key_raw;
}
