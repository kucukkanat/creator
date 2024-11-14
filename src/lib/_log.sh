_log(){
  local level=$1
  shift
  if [ "$level" == "error" ]; then
    echo -e "\033[31m$@\033[0m"
  elif [ "$level" == "success" ]; then
    echo -e "\033[32m$@\033[0m"
  elif [ "$level" == "warning" ]; then
    echo -e "\033[33m$@\033[0m"
  elif [ "$level" == "info" ]; then
    echo -e "\033[34m$@\033[0m"
  elif [ -z "$level" ]; then
    echo $@
  else
    echo $@
  fi
}
# _log error This is an error
# _log warning This is a warning
# _log success This is a success
# _log info This is an info messsage
# _log "" This is a normal message