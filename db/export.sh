collections=("users" "items")

for collection in "${collections[@]}"
do
  echo "Exporting $collection"
  mongoexport --db wordlistdb --collection $collection --out ./seeds/$collection.json --jsonArray --pretty
done

echo 'Done'
