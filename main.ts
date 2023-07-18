import * as modules from "./module-manager.ts";
import prompts from "npm:prompts";

modules.startup.check();
const user_input_prompt = await prompts({
  type: "text",
  name: "input",
  message: "",
});

//todo add automatic detection

const input_type = "text";
// const input_type = "file";
