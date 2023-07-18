import prompts from "npm:prompts";

import * as modules from "./module-manager.ts";

modules.homepage.start();

const user_input_prompt = await prompts({
  type: "text",
  name: "input",
  message: "",
});
