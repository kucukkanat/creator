import { mkdirSync } from "node:fs";
import { execSync } from "node:child_process";

export async function setJsonField(
  filePath: string,
  field: string,
  value: any
) {
  const pkg = JSON.parse(Deno.readTextFileSync(filePath));
  pkg[field] = value;
  Deno.writeTextFileSync(filePath, JSON.stringify(pkg, null, 2));
}
export async function init_package(
  dir: string,
  scopeName: string,
  packageName: string
) {
  // Create and move to directory
  mkdirSync(dir, { recursive: true });
  execSync(`cd ${dir} && npm init -y`);
  await setJsonField(
    `${dir}/package.json`,
    "name",
    `@${scopeName}/${packageName}`
  );

  return `Created package in ${dir} named "@${scopeName}/${packageName}`;
}
