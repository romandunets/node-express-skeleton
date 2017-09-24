collections=('users' 'items')

for collection in "${collections[@]}"
do
  echo "Importing $collection"
  mongoimport --db "node-express-skeleton-$1" --collection $collection --file ./db/seeds/$collection.json --jsonArray
done

echo 'Done'
