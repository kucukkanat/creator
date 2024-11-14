# Project Creator

This is a CLI to easily create a monorepo to build web components apps

### Tech stack

- Web Components with [Lit](https://lit.dev)
- Tailwindcss
  - Daisyui
  - Flowbite
  - PostCSS
- Vite for bundling
- Storybook for isolated component development
- Mobx for state management

### Commands

```shell
# Creates a new project
creator create --name myproject --root . --useBun

# Creates a new web component with Lit @kucukkanat/mycomponent npm package
creator component --name mycomponent --scope kucukkanat --lightDOM
```

## Developing the project

This project uses [bashly](https://bashly.dannyb.co/) framework.

Set alias:

```sh
alias bashly='docker run --rm -it --user $(id -u):$(id -g) --volume "$PWD:/app" dannyben/bashly'
```

To build run `bashly generate`
