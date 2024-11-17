import process from "node:process";
import { default as CreatePackage } from "./package.ts";
import { AlterPackageJSON, FileTemplate, InitWithVite } from "#/utils.ts";
import { execSync } from "node:child_process";
const validate = {
  name: (name: string) => {
    if (!name.includes("-")) {
      console.log("Component names should be kebab-case");
      Deno.exit(1);
    }
  },
};
export default function (options: any, name: string) {
  console.log("Creating a component with options", options);
  validate.name(name);

  InitWithVite({
    name,
    template: options.template,
    useBun: options.useBun,
  });

  Deno.chdir(name);
  // Remove vite generated redundant files
  execSync(
    `rm -rf src/{index.css,my-element.ts,vite-env.d.ts} src/assets public`,
  );

  // Overwrite the index.ts file
  new FileTemplate<{ name: string; light: boolean }>(
    `src/index.ts`,
    ({ name, light }) =>
      /*ts*/ `import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('${name}')
export class Component extends LitElement {
    ${
        light
          ? `createRenderRoot(): HTMLElement | DocumentFragment  {
        return this;
    }`
          : ""
      }
    render() {
        return html\`<h1>${name}</h1>\`;
    }
}
    `,
  ).write({ name, light: options.light });

  AlterPackageJSON({
    name: options.scope ? `@${options.scope}/${name}` : name,
  });
}
