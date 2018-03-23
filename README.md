#interfaces

## Rating Module
calculates a nutrition score based on nutritional info. Takes a fully formed `nutritionalInfo` object and returns a fully formed `score` object.
```
export default (nutritionalInfo) => {
  ////...

  return score;
}
```

## Fetch Module
pulls nutrition info from third party sources. Returns either undefined, or a fully formed `nutritionalInfo`.
```
export default (upc) => {
  ////...

  return nutritionalInfo;
}
```

## Example `nutritionalInfo` object
```
{
  "category": "Starch",
  "subCategory": "Rice",
  "sodium":"10"
  "sugar":"20"
  "fat": "30"
}
```

Valid categories:
 - Tomatoes
 - Canned Beans
 - Vegetables
 - Fruits
 - Protein
 - Pasta/Rice
 - Pasta Sauce
 - Cereal

 Valid sub-categories:
  - Fresh
  - Canned

## Example `score` object
 ```
 {
    “score”: 5
 }
 ```
