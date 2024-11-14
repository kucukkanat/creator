function set_json(){
  local file=$1
  local key=$2
  local value=$3

  echo "Setting $key to $value in $file"

  cat $file | jq --arg k "$key" \
  --arg v "$value" \
  '.[$k] = $v' > temp.json
  mv temp.json $file
}
