collections=('users' 'items')

for collection in "${collections[@]}"
do
  echo "Exporting $collection"
  mongoexport --db "node-express-skeleton-$1" --collection $collection --out ./db/seeds/$collection.json --jsonArray --pretty
done

echo 'Done'
