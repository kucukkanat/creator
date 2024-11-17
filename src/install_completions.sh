#!/usr/bin/env zsh
COMPLETIONS_PATH="$HOME/.creator-completions.zsh"
deno run -A main.ts completions zsh --name creator > $COMPLETIONS_PATH

echo "Add this to your $HOME/.zshrc file:"
echo "================================================"
echo "source $COMPLETIONS_PATH"
echo "================================================"

echo ""
echo "Also make sure \"creator\" is installed and is in your PATH."