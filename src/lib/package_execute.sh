package_execute(){
  if [ $1 == "withbun" ]; then
    echo "Using Bun to install package"
    bunx $2
  elif [ $1 == "withnpm" ]; then
    echo "Using npm to install package"
    npx $2
  else
    echo "No package manager specified"
  fi
}