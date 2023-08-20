//todo Add instructions
//note We will generate a private and public certificate and save both

import * as modules from "../module-manager.ts";

export async function start() {
  modules.logo.print();
  const password_hash: string = await modules.auth.setup();
  modules.rsa.setup(password_hash);
}
