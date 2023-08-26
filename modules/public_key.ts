import * as modules from "../module-manager.ts";

export async function share(publicPem: string) {
  const body = `content=${publicPem}&expiry_days=365`;
  const req = await fetch(modules.config.paste_api, {
    method: "POST",
    headers: {
      "User-Agent": modules.config.user_agent,
    },
    body,
  });
  if (req.status === 200) {
    console.log("Working");
    console.log(req);
  } else {
    console.log("ERROR contacting " + modules.config.paste_api);
  }
}
