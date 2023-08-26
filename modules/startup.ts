import * as modules from "../module-manager.ts";
import fs from "node:fs";

export function check() {
  if (fs.existsSync(modules.config.app_folder)) {
    modules.logo.print();
    modules.auth.login();
  } else {
    fs.mkdirSync(modules.config.app_folder, { recursive: true });
    modules.setup.start();
  }
}
