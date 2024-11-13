import path from "node:path";
import {
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
  readFileSync,
  write,
} from "node:fs";
import { execSync, exec } from "node:child_process";
import { setJsonField } from "../utils.ts";

export default async ({ name, useBun = true, root, help }) => {
  if (help) {
    helpFN();
    return;
  }
  const ROOT_DIR = path.resolve(process.cwd(), root) || process.cwd();

  process.chdir(ROOT_DIR);
  const installAlias = useBun ? "bun add" : "npm install";
  const executeAlias = useBun ? "bunx" : "npx";
  // SET PROJECT ROOT DIRECTORY
  const PROJECT_DIR = path.join(ROOT_DIR, name);
  // Clean up old project directory and create a new one
  if (existsSync(PROJECT_DIR)) {
    //ask before deletion iwth Deno prompt
    const response = prompt(
      "Directory already exists. Do you want to delete it? [y/N]"
    );
    if (response === "y" || response === "yes" || response === "Y") {
      rmSync(PROJECT_DIR, { recursive: true });
    } else {
      console.log("Exiting...");
      process.exit(1);
      return;
    }
  }

  mkdirSync(PROJECT_DIR);
  process.chdir(PROJECT_DIR);
  execSync(`npm init -y`);
  setJsonField(path.join(PROJECT_DIR, "package.json"), "type", "module");
  setJsonField(path.join(PROJECT_DIR, "package.json"), "workspaces", [
    "packages/*",
  ]);

  // Start creating packages
  const packageDirs = ["packages/app", "packages/components", "packages/core"];
  for (const dir of packageDirs) {
    const fullPath = path.join(PROJECT_DIR, dir);
    CreatePackage(fullPath, name);
    console.log(`Initialized package in ${fullPath}`);
  }

  // Setup frontend package
  process.chdir(path.join(PROJECT_DIR, "packages/app"));
  createFiles();
  console.log(
    execSync(`${installAlias} vite tailwindcss postcss autoprefixer`).toString()
  );
  console.log(
    execSync(
      `${installAlias} lit @lit-labs/router urlpattern-polyfill`
    ).toString()
  );
  console.log(execSync(`${installAlias} daisyui flowbite`).toString());
  exec(`${executeAlias} storybook@latest init`, (error, stdout, stderr) => {
    console.log(`Storybook stdout: ${stdout}`);
    if (error) {
      console.error(`Error initializing Storybook: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Storybook stderr: ${stderr}`);
      return;
    }
  });
};

export const helpFN = () => {
  console.log(`
    Usage: create --name <project_name> [Options]

    Options:
      --name    Project name [Required]
      --useBun  Use Bun instead of NPM
      --root    Root directory to create project in
  `);
};
// Function to create configuration files
function createFiles() {
  writeFileSync(
    "postcss.config.js",
    `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "tailwindcss/nesting": {},
  },
};
    `
  );

  writeFileSync(
    "tailwind.config.js",
    `
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  plugins: [
    require("daisyui"),
    require("flowbite/plugin"),
    "tailwindcss/nested",
  ],
};
    `
  );

  writeFileSync(
    "vite.config.ts",
    `
import { defineConfig } from "vite";

export default defineConfig({
  appType: "spa",
  root: "src",

  server: {
    port: 8080,
  },
  build: {
    outDir: "dist",
    // lib: {
    //   entry: "components/x-prompt.ts",
    //   name: "x-prompt",
    //   fileName: "x-prompt",
    // },
  },
  resolve: {
    alias: {
      // "@": "/src",
    },
  },
});
    `
  );
  mkdirSync("src");
  writeFileSync(`src/index.ts`, ``);
  writeFileSync(
    `src/index.html`,
    `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Project</title>
</head>
<body>
  <script type="module" src="index.ts"></script>
</body>
</html>
`
  );
  console.log("Configuration files created.");
}

// Function to initialize a package in a given directory
function CreatePackage(dir, scopeName) {
  if (!dir || !scopeName) {
    console.error("Usage: CreatePackage <directory> <scope-name>");
    return;
  }

  // Create and move to directory
  mkdirSync(dir, { recursive: true });
  process.chdir(dir);
  execSync(`npm init -y`);

  // Set name in package.json
  const packageName = path.basename(dir);
  const nameValue = `@${scopeName}/${packageName}`;
  setJsonField(path.join(dir, "package.json"), "name", nameValue);

  console.log(`Updated package.json name to ${nameValue} in ${dir}`);
}
