import { program } from "npm:commander";
import { execSync } from "node:child_process";
program
  .name("creator")
  .description("Utiliy pack for your javascript monorepos")
  .option("-b, --useBun [boolean]", "useBun instead of npm")
  .version("0.1.0");

const create = program.command("create")
  .description("Create anything")

create.command("project")
  .argument("<name>", "project name")
  .action((name, options) => {
    execSync(`mkdir -p ${name}`);
    process.chdir(name);
  });
program.parse();

