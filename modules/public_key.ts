import * as modules from "../module-manager.ts";

export async function share(publicPem: string) {
  /* const body = `content=${publicPem}&expiry_days=365`; */
  const body = `content=${publicPem}&expiry_days=1`; //note change expiry_days
  const req = await fetch(modules.config.paste_api, {
    method: "POST",
    headers: {
      "User-Agent": modules.config.user_agent,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (req.status === 201) {
    const key = (await req.text()).replace(modules.config.paste_prefix, "");
    const web_key = await fetch(
      modules.config.paste_prefix + key + modules.config.raw_paste_suffix
    );
    const web_key_raw = await web_key.text();
    const hash = modules.hash.create(web_key_raw);
    const key_id = key + "|" + hash;
    console.log(key_id);
  } else {
    console.log("Error!");
  }
}
