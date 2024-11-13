import { mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { setJsonField } from "../utils.ts";

const root = process.cwd();
export default function ({ name, scope, lightDOM, help }) {
  if (help) {
    console.log(`Create a new LitElement component
    Usage:
      create <name> [options]
    Options:
      --name      Name of the component package
      --scope     Scope of the package
      --lightDOM  Use light DOM
    `);
    return;
  }
  const dir = `${root}/${name}`;
  mkdirSync(dir, { recursive: true });
  process.chdir(dir);
  execSync(`npm init -y`);

  const packageName = scope ? `@${scope}/${name}` : name;
  setJsonField(`${dir}/package.json`, "name", packageName);
  setJsonField(`${dir}/package.json`, "main", "dist/index.js");

  // Create the file
  const filePath = `${dir}/src/components/x-${name}.ts`;
  Deno.writeTextFileSync(filePath, fileTemplate(name, lightDOM));
}

const fileTemplate = (
  name,
  lightDOM = true
) => `import {LitElement, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

@customElement('x-${name}')
export class X${name} extends LitElement {
  // #region Properties and state
  @property({type: String}) 
  title = 'Hello world';
  @state()
  count = 0;
  // #endregion
  
  ${
    lightDOM
      ? `
  createRenderRoot() {
    return this;
  }`
      : ""
  }
  render() {
    return html\`
      <style>
        :host {
          display: block;
        }
      </style>
      Hello world!
    \`;
  }
}
`;
