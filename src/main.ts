#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net --allow-env --allow-run

import { Command, EnumType } from "@cliffy/command";
import { CompletionsCommand } from "@cliffy/command/completions";
import { default as CreateComponentAction } from "./create/component.ts";
import { default as CreateProjectAction } from "./create/project.ts";
import { default as CreatePackageAction } from "./create/package.ts";
import { default as CreateApp } from "./create/app.ts";

const templates = new EnumType([
    "vanilla",
    "vanilla-ts",
    "vue",
    "vue-ts",
    "react",
    "react-ts",
    "react-swc",
    "react-swc-ts",
    "preact",
    "preact-ts",
    "lit",
    "lit-ts",
    "svelte",
    "svelte-ts",
    "solid",
    "solid-ts",
    "qwik",
    "qwik-ts",
]);
await new Command()
    .command(
        "create",
        new Command()
            // Create a project
            .command("project")
            .type("template", templates)
            .description("Create a new project")
            .arguments("<name:string>")
            .action(CreateProjectAction)
            // Create a package
            .command("package")
            .description("Create a new package")
            .arguments("<name:string>")
            .option(
                "-d, --deps [dependencies...:string]",
                "Dependencies to install",
            )
            .option(
                "--dev [devDependencies...:string]",
                "Development dependencies to install",
            )
            .option(
                "-t, --template [type:string]",
                "Template to create the package with",
                {
                    default: "vanilla-ts",
                },
            )
            .action(CreatePackageAction)
            // Create a component
            .command("component")
            .type("template", templates)
            .description("Create a new component")
            .arguments("<name...:string>")
            .option("-l, --light", "Use light DOM")
            .option(
                "-t, --template [type:template]",
                "Pick a template to create the component",
                {
                    default: "lit-ts",
                },
            )
            .action(CreateComponentAction),
    )
    .alias("c")
    .globalOption("-b, --useBun [true/false:boolean]", "useBun instead of npm")
    .globalOption("-s, --scope [scope:string]", "Scope of the package")
    .globalOption("-d, --debug [debug:boolean]", "Print all arguments to debug")
    .description("Monorepo toolkit")
    .version("v1.0.0")
    .command("completions", new CompletionsCommand())
    .parse();
