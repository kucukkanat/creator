name=${args[name]}
root=${args[--root]}
useBun=${args[--useBun]}


echo "Creating a new project with name: $name"
echo ""


# Create directory and init
if [ ! -d $root ]; then
  # Warn and exit if root does not exist
  _log warning "Root directory does not exist"
  _log warning "Please provide a valid root directory"
  exit 1
fi

cd $root
PROJECT_DIR=$(pwd)/$name
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR
npm_init silent

# Set package json
set_json package.json "type" "module"
cat package.json | jq '."workspaces".[0] = "packages/*"' > .temp
mv .temp package.json

# Default packages to create
packages_to_create=( "app" "core" );
# Init created each package
for package in ${packages_to_create[@]}; do
  _log info "Creating package: $package"
  create_package "$useBun" $package
  
  cd $PROJECT_DIR
done
