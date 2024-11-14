npm_init(){
  local silent=$1
  if [ -n "$silent" ]; then
    npm init -y > '/dev/null' 2>&1
    return
  else
    npm init -y
  fi
}