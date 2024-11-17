import { $ } from "https://deno.land/x/dzx@0.4.0/mod.ts";
export default async function CreateApp(options: any, name: string) {
    console.log("Creating a new frontend app using Vite Lit and Tailwind");
}

const templates = {
    ["postcss.config.js"]: () =>
        /*ts*/ `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "tailwindcss/nesting": {},
  },
};`,
    ["vite.config.ts"]: () =>
        /*ts*/ `import { defineConfig } from "vite";
export default defineConfig({
  appType: "spa",
  root: "src",

  server: {
    port: 8080,
  },
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: {
      // "@": "/src",
    },
  },
});`,
};
