//todo Add instructions
//note We will generate a private and public certificate and save both

import * as modules from "../module-manager.ts";

export async function start() {
  modules.homepage.start();
  const password_hash = await modules.auth.setup();
  modules.rsa.setup(password_hash);
}
