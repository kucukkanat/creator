import { parseArgs } from "jsr:@std/cli/parse-args";

import help from "./commands/help.ts";
import create from "./commands/create.ts";
import component from "./commands/component.ts";

const actions = { help, create, component };

const args = parseArgs(Deno.args);
const command = args._[0];

if (!actions[command]) {
  console.log("Command not found");
  console.log(`Available commands: ${Object.keys(actions).join(", ")}`);
  Deno.exit(1);
} else {
  await actions[command](args);
}
