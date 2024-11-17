import { Command } from "@cliffy/command";
import { CompletionsCommand } from "@cliffy/command/completions";
import { default as CreateComponentAction } from "./create/component.ts";
import { default as CreateProjectAction } from "./create/project.ts";
import { default as CreatePackageAction } from "./create/package.ts";

await new Command()
    .command(
        "create",
        new Command()
            // Create a project
            .command("project")
            .description("Create a new project")
            .arguments("<name:string>")
            .option("-d, --debug [level]", "output extra debugging.")
            .action(CreateProjectAction)
            // Create a package
            .command("package")
            .description("Create a new package")
            .arguments("<name:string>")
            .option(
                "-d, --deps [dependencies...:string]",
                "Dependencies to install",
            )
            .action(CreatePackageAction)
            // Create a component
            .command("component")
            .description("Create a new component")
            .arguments("<name:string>")
            .option("-l, --light", "Use light DOM")
            .action(CreateComponentAction),
    )
    .alias("c")
    .globalOption("-b, --useBun [true/false:boolean]", "useBun instead of npm")
    .globalOption("-s, --scope [scope:string]", "Scope of the package")
    .description("Monorepo toolkit")
    .version("v1.0.0")
    .command("info")
    .description("Displays information about the tool")
    .command("completions", new CompletionsCommand())
    .parse();
