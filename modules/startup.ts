import * as modules from "../module-manager.ts";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";

export function check() {
  const app_folder = path.join(os.homedir(), "LxCrypt");

  if (fs.existsSync(app_folder)) {
    modules.homepage.start();
    modules.homepage.instructions();
  } else {
    modules.setup.start();
  }
}
