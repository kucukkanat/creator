import { execSync } from "node:child_process";
import { AlterPackageJSON } from "#/utils.ts";
export default async function (_: any, name: string) {
    console.log(`Creating a new project: ${name}`);
    execSync(`mkdir -p ${name}`);
    process.chdir(name);
    execSync(`npm init -y`);
    await AlterPackageJSON({
        type: "module",
        name: name,
        workspaces: ["packages/*"],
    });
}
