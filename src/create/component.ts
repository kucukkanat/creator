import { $, cd, path } from "https://deno.land/x/dzx@0.4.0/mod.ts";
import { default as CreatePackage } from "./package.ts";
export default async function (options: any, name: string) {
    console.log("Creating a component with options", options);
    if (!name.includes("-")) {
        console.log("Component names should be kebab-case");
        Deno.exit(1);
    }
    await CreatePackage({ ...options, deps: ["lit"] }, name);

    // Overwrite the index.ts file
    await Deno.writeFile(
        path.join("src", "index.ts"),
        new TextEncoder().encode(template(name, options.light)),
    );
}

function template(name: string, useLightDOM: boolean): string {
    return `import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('${name}')
export class Component extends LitElement {
    ${
        useLightDOM
            ? `createRenderRoot(): HTMLElement | DocumentFragment  {
        return this;
    }`
            : ""
    }
    render() {
        return html\`<h1>${name}</h1>\`;
    }
}
    `;
}
