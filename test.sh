#!/usr/bin/env zsh
alias bashly='docker run --rm -it --user $(id -u):$(id -g) --volume "$PWD:/app" dannyben/bashly'
bashly generate
./creator-cli create mypackage --root dist
cd dist/mypackage
../../creator-cli package create withdeps -d vite -d mobx --useBun yes
../../creator-cli package create withdeps_npm -d vite -d mobx