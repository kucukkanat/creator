import { Command } from "@cliffy/command";
import { CompletionsCommand } from "@cliffy/command/completions";
await new Command()
    .command(
        "create",
        new Command()
            .command("project")
            .description("Create a new project")
            .option("-d, --debug [level]", "output extra debugging.")
            .action((options) => {
                console.log("Create project with options", options);
            })
            .command("package")
            .description("Create a new package")
            .option("-d, --debug [level]", "output extra debugging.")
            .action((options) => {
                console.log("Create package with options", options);
            })
            .command("component")
            .description("Create a new component")
            .action((options) => {
                console.log("Create component with options", options);
            }),
    )
    .alias("c")
    .globalOption("-b, --useBun [true/false:boolean]", "useBun instead of npm")
    .description("Monorepo toolkit")
    .version("v1.0.0")
    .command("info")
    .description("Display information about the package")
    .command("completions", new CompletionsCommand())
    .parse();
