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
    console.log("working");
  } else {
    console.log("error");
  }
}
