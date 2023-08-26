//TODO HASH PRIVATE AND PUBLIC CERT
//TODO STORE IN JSON DATABASE

import * as modules from "../module-manager.ts";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export function create() {
  const private_key_file = fs.readFileSync(
    path.join(app_folder, "private_key.lxcf")
  );

  const hash = modules.hash.create("Input");
  console.log(hash);
}
export function check() {}
