import * as modules from "./module-manager.ts";

globalThis.addEventListener("unload", () => {
  console.clear();
});

modules.startup.check();
