import { execSync } from "node:child_process";
import { dirname } from "node:path";
function GetPackageJSON() {
    const decoder = new TextDecoder("utf-8");
    try {
        const packageJSON = Deno.readFileSync("package.json");
        const packageJSONString = decoder.decode(packageJSON);
        return JSON.parse(packageJSONString);
    } catch (e) {
        return null;
    }
}
export async function AlterPackageJSON(obj: object) {
    const json = GetPackageJSON();
    if (json === null) {
        console.error("No package.json found in the current working directory");
        Deno.exit(1);
    }
    const altered = Object.assign(json, obj);
    await Deno.writeFile(
        "package.json",
        new TextEncoder().encode(JSON.stringify(altered, null, 2)),
    );
    return altered;
}

export class FileTemplate<T> {
    constructor(
        private filePath: string,
        private template: (args: T) => string,
    ) {}
    write(templateArgs: T) {
        // Assure the directory exists
        const dir = dirname(this.filePath);
        Deno.mkdirSync(dir, { recursive: true });
        Deno.writeFileSync(
            this.filePath,
            new TextEncoder().encode(this.template(templateArgs)),
            {
                create: true,
            },
        );
    }
}
// #region vite_templates
type ViteTemplates =
    | "vanilla"
    | "vanilla-ts"
    | "vue"
    | "vue-ts"
    | "react"
    | "react-ts"
    | "react-swc"
    | "react-swc-ts"
    | "preact"
    | "preact-ts"
    | "lit"
    | "lit-ts"
    | "svelte"
    | "svelte-ts"
    | "solid"
    | "solid-ts"
    | "qwik"
    | "qwik-ts";
// #endregion
export function InitWithVite(
    { name, template, useBun, debug }: {
        name: string;
        template: ViteTemplates;
        useBun?: boolean;
        debug?: boolean;
    },
) {
    const ROOT_DIR = Deno.cwd();
    if (debug) console.log("Creating package", { name, template, useBun });
    if (useBun) {
        console.log('Creating package with "bun"');
        execSync(`bun create vite ${name} --template ${template}`);
        Deno.chdir(name);
        execSync(`bun install`);
    } else {
        execSync(`npm create vite ${name} -- --template ${template}`);
        Deno.chdir(name);
        execSync(`npm install`);
    }
    InstallTailwindCSS({ useBun, plugins: ["daisyui"] });
    Deno.chdir(ROOT_DIR);
}

/**
 * Sets up TailwindCSS with PostCSS and Autoprefixer in the project
 * Installs DaisyUI by default {@link https://daisyui.com }
 * @param { useBun: boolean; plugins: string[] }
 */

export function InstallTailwindCSS(
    { useBun, plugins = ["daisyui"] }: { useBun?: boolean; plugins: string[] },
) {
    // Install tailwindcss
    InstallDependencies({
        dependencies: ["tailwindcss", "autoprefixer", "postcss", ...plugins],
        useBun,
    });
    new FileTemplate<{ plugins: string[] }>(
        "tailwind.config.js",
        () =>
            /*js*/ `module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  plugins: [
    ${plugins.map((plugin) => `require("${plugin}"),`).join("\n")}
    "tailwindcss/nested",
  ],
};`,
    ).write({ plugins });
    // Add postcss config
    new FileTemplate(
        "postcss.config.js",
        () =>
            /*js*/ `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "tailwindcss/nesting": {},
  },
};`,
    ).write({});
}

export function InstallDependencies(
    { dependencies, useBun, isDev, flags }: {
        dependencies: string[];
        useBun?: boolean;
        isDev?: boolean;
        flags?: string;
    },
) {
    const extras = `${isDev ? "--save-dev" : ""} ${flags ?? ""}`;
    console.log(`Installing those dependencies:`, dependencies);
    if (useBun) {
        execSync(`bun add ${dependencies.join(" ")} ${extras}`);
    } else {
        console.log(`npm install ${dependencies.join(" ")} ${extras}`);
        execSync(`npm install ${dependencies.join(" ")} ${extras}`);
    }
}

export function CreateAndCD(p: string) {
    execSync(`mkdir -p ${p}`);
    Deno.chdir(p);
}
