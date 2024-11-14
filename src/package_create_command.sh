package_name=${args[name]}
useBun=${args[--useBun]}
dependencies=${args[--dep]}
ROOT_DIR=$(pwd)

echo "Use BUN: $useBun"
create_package "$useBun" $package_name "${dependencies[*]}"

# INSPECT
# inspect_args