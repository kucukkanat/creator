import { $, cd } from "https://deno.land/x/dzx@0.4.0/mod.ts";
import { AlterPackageJSON } from "#creator/utils.ts";
export default async function (_: any, name: string) {
    console.log(`Creating a new project: ${name}`);
    await $`mkdir -p ${name}`;
    cd(name);
    await $`npm init -y`;
    await AlterPackageJSON({
        type: "module",
        name: name,
        workspaces: ["packages/*"],
    });
}
