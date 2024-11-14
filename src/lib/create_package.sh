create_package(){
  local useBun=$1
  local name=$2
  local dependencies=$3

  local scope=$(cat package.json | jq -r '.name')
  if [ -z $scope ]; then
    _log warning "No scope found in package.json"
    _log warning "Setting scope to @undefined"
    scope=undefined
  fi
  package_dir="packages/$name"
  mkdir -p $package_dir
  cd $package_dir
  npm_init silent

  _log info "Setting project name to $name"
  # Set package json name
  cat package.json | jq \
  --arg n "@$scope/$name" \
  '."type" = "module" | .name = $n' > temp.json
  mv temp.json package.json


  if [ -n "${dependencies[*]}" ]; then
  echo "Usebun is :: $useBun"
    # Install dependencies
    # It is crucial to use quotes with -n !!!
    if [ -n "$useBun" ]; then
      _log info "[package: ${name}] Using Bun to install dependencies: ${dependencies[*]}"
      bun add ${dependencies[*]} --silent
    else
      _log info "[package: ${name}] Using npm to install dependencies: ${dependencies[*]}"
      _log "" "Installing dependencies ${dependencies[*]}"
      npm install ${dependencies[*]} > '/dev/null' 2>&1
    fi
  fi
}
