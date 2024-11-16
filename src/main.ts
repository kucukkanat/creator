import { program } from "npm:commander";
import { execSync } from "node:child_process";

program
  .name("creator")
  .description("Utiliy pack for your javascript monorepos")
  .option("-b, --useBun [boolean]", "useBun instead of npm")
  .version("0.1.0");

const create = program.command("create").description("Create anything");

create
  .command("project")
  .argument("<name>", "project name")
  .action((name, options) => {
    const decoder = new TextDecoder("utf-8");
    execSync(`mkdir -p ${name}`);
    process.chdir(name);
    execSync("npm init -y");
    const packageJSON = Deno.readFileSync("package.json");
    const packageJSONString = decoder.decode(packageJSON);
    const packageJSONObj = JSON.parse(packageJSONString);
    packageJSONObj.workspaces = ["packages/*"];
    Deno.writeFileSync(
      "package.json",
      new TextEncoder().encode(JSON.stringify(packageJSONObj, null, 2))
    );
  });

create
  .command("package")
  .argument("<name>", "package name")
  .option("-s, --scope [scope]", "scope of the package")
  .option(
    "-d, --dependencies [deps...]",
    "dependencies to install in the package"
  )
  .action(createPackage);

create
  .command("component")
  .description("Create a web component using lit")
  .argument("<name>", "component name")
  .option("-s, --scope [scope]", "scope of the package")
  .option("-l, --useLightDOM", "use light DOM")
  .action(createComponent);
program.parse();

console.log(`Program global options:`, program.opts());

function getPackageJSON() {
  const decoder = new TextDecoder("utf-8");
  try {
    const packageJSON = Deno.readFileSync("package.json");
    const packageJSONString = decoder.decode(packageJSON);
    return JSON.parse(packageJSONString);
  } catch (e) {
    return null;
  }
}

/**
 * Alters packageJSON in the  current working directory by
 * merging it with the given object and writing it back
 */
function alterPackageJSON(obj: object) {
  const json = getPackageJSON();
  const altered = Object.assign(json, obj);
  Deno.writeFileSync(
    "package.json",
    new TextEncoder().encode(JSON.stringify(altered, null, 2))
  );
  return altered;
}

function installDependencies(dependencies: string) {
  const useBun = program.opts().useBun;
  if (useBun) {
    execSync(`bun add ${dependencies}`);
  } else {
    execSync(`npm install ${dependencies}`);
  }
}

function packagemanagerExecuteFN(command: string) {
  const useBun = program.opts().useBun;
  if (useBun) {
    execSync(`bunx ${command}`);
  } else {
    execSync(`npx ${command}`);
  }
}

function createPackage(
  name: string,
  { scope, dependencies }: { scope: string; dependencies: string[] }
) {
  // Check if I am at the project root by checking if there is a package.json and it has workspaces
  const rootPackageJSON = getPackageJSON();
  if (!rootPackageJSON?.workspaces) {
    console.error("You are not at the root of the project");
    Deno.exit(1);
  }

  // Create the package directory go inside and initialize
  console.log(`Creating package ${name}`);
  execSync(`mkdir -p packages/${name}`);
  process.chdir(`packages/${name}`);
  execSync("npm init -y");
  execSync("mkdir -p src");
  execSync("touch src/index.ts");
  alterPackageJSON({
    type: "module",
    name: scope ? `@${scope}/${name}` : name,
    scripts: {
      build: "bun build ./src/index.ts --outfile=dist/index.js",
    },
    main: "dist/index.js",
    files: ["dist"],
  });

  // Install dependencies if any
  if (dependencies) {
    console.log(
      `Installing dependencies using ${
        program.opts().useBun ? "bun" : "npm"
      } ${dependencies.join(" ")}`
    );
    installDependencies(dependencies.join(" "));
  }
}

function createComponent(
  name: string,
  { scope, useLightDOM }: { scope: string; useLightDOM: boolean }
) {
  createPackage(name, {
    scope,
    dependencies: ["lit", "urlpattern-polyfill"],
  });
  const componentTemplate = `import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
@customElement("${name}")
export class XChat extends LitElement {
  @property()
  counter: number = 0;
  ${
    useLightDOM
      ? `
  createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }`
      : ``
  }
  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
  }
  render() {
    return html\`Hello world!\`;
  }
}`;
  Deno.writeFileSync(
    `src/${name}.ts`,
    new TextEncoder().encode(componentTemplate)
  );
}
