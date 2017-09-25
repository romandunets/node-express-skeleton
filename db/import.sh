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
  echo "Importing $collection"
  mongoimport --db "node-express-skeleton-$environment" --collection $collection --file ./db/seeds/$collection.json --jsonArray
done

echo "Done"
