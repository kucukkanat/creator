import { $, cd } from "https://deno.land/x/dzx@0.4.0/mod.ts";
import { AlterPackageJSON } from "#creator/utils.ts";
export default async function (options: any, name: string) {
    if (options.scope && options.scope.includes("@")) {
        console.log("The scope should not include the '@' symbol");
        Deno.exit(1);
    }
    console.log(`Creating a new package: ${name}`);
    await $`mkdir -p packages/${name}`;
    cd(`packages/${name}`);
    await $`npm init -y`;
    await $`mkdir -p src`;
    await $`touch src/index.ts`;
    await AlterPackageJSON({
        type: "module",
        name: options.scope ? `@${options.scope}/${name}` : name,
        scripts: {
            build: "bun build ./src/index.ts --outfile=dist/index.js",
        },
        main: "dist/index.js",
        files: ["dist"],
    });
    if (options.deps) {
        if (options.useBun) {
            await $`bun add ${options.deps.join(" ")}`;
        } else {
            await $`npm install ${options.deps.join(" ")}`;
        }
    }
}
