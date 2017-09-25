#!/bin/bash

collections=("users" "items")
environment="dev"

if [[ "$1" != "" ]]
then
  environment=$1
fi

echo "Using env = $environment"

for collection in "${collections[@]}"
do
  echo "Exporting $collection"
  mongoexport --db "node-express-skeleton-$environment" --collection $collection --out ./db/seeds/$collection.json --jsonArray --pretty
done

echo 'Done'
