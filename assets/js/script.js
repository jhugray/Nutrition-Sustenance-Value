var cuisineType = "";
var healthType = "";

function generateRecipes() {

// captures drop down inputs and joins them with & to fit API needs
  var cuisineType = $("#cuisine_chosen .result-selected") 
    .map(function() {
      return "cuisineType=" + this.innerHTML;
    })
    .get()
    .join("&");
  console.log(cuisineType); 

  var healthType = $("#health_chosen .result-selected")
    .map(function() {
      return "healthType=" + this.innerHTML;
    })
    .get()
    .join("&");
  console.log(healthType);

  // ingredients pulled from input
  var ingredients = document.querySelector("#ingredient").value;
  console.log(ingredients);
  //API URL with ingredients input added
  var apiURL = "https://api.edamam.com/api/recipes/v2?type=public&q=" 
  + ingredients 
  + "&app_id=d79a6135&app_key=%20640f82c48f99da84b3fcbf2e006bd954&ingr=1-10&diet=balanced&health=gluten-free&health=tree-nut-free&"
  + cuisineType
  + "&time=0-20&imageSize=REGULAR&random=true&field=uri&field=label&field=image&field=source&field=url&field=yield&field=dietLabels&field=healthLabels&field=cautions&field=ingredientLines&field=ingredients&field=calories&field=totalWeight&field=totalTime&field=cuisineType&field=mealType&field=dishType&field=totalNutrients&field=totalDaily"

    fetch(apiURL)
    .then(function(response) {
      //request was successful
      if (response.ok) {
        response.json().then(function(data) {
        console.log(data);

        //grabbing where the recipe cards will go, and setting it to empty to clear if repeat searches are done
        var recipeContainer = document.getElementById("recipe-card-container");
        recipeContainer.innerHTML = "";

        // for loop to populate 3 recipe cards with info captured from the API
        for (var i = 0; i <=2; i++) {
          var recipeEl = document.createElement("div");
          recipeEl.classList = "text-center";
          recipeEl.setAttribute("id", "generate");
          recipeEl.innerHTML = data.hits[i].recipe.label + "<br />";
          console.log(data.hits[i].recipe.label);
          recipeEl.innerHTML+= "Serves: " + data.hits[i].recipe.yield +  "<br />";
          recipeEl.innerHTML+= '<img src="' + data.hits[i].recipe.image + '"> <br />';
          recipeEl.innerHTML+= "Ingrediets: " + data.hits[i].recipe.ingredientLines +  "<br /> <br />";
          recipeEl.innerHTML+= "<a href='" + data.hits[i].recipe.url + "' target='_blank'>Click here to go to the recipe!</a> <br />";
          recipeContainer.appendChild(recipeEl);

        };
        });
      };
    });
}


// This is for the dropdown plug in to get them to work
$(function() {
  $(".chosen-select").chosen({
    max_selected_options: 3,
    width: "90%",
  });
});

// Content for the map with working access token
mapboxgl.accessToken =
  "pk.eyJ1IjoiYXp1cnl0ZSIsImEiOiJja3U5dGpsbjYwYTZnMnZubmVtZXZ4bzcyIn0.4TNon4_EuBE9I_4Xg-U7kQ";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/dark-v10", // style URL
  center: [-75.69, 45.42], // starting position [lng, lat]
  zoom: 12, // starting zoom
});

// Add the control to the map.
map.addControl(
  new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl
  })
  );

var shopLong = " "
var shopLat = " "
var shopTitle = " "
var shopAddress = " " 
//Map API
var alsoApiURL = "https://api.mapbox.com/geocoding/v5/mapbox.places/market%2Cbutcher.json?access_token=pk.eyJ1IjoiYXp1cnl0ZSIsImEiOiJja3U5dGpsbjYwYTZnMnZubmVtZXZ4bzcyIn0.4TNon4_EuBE9I_4Xg-U7kQ&cachebuster=1633231166631&autocomplete=false&types=poi&bbox=-76.2%2C45.0%2C-75.2%2C45.6&limit=10"
  fetch(alsoApiURL)
  .then(function(response) {
    //request was successful
    if (response.ok) {
      return response.json().then(function(response) {
      console.log(response) 
      console.log("Long,Lat is " + response.features[0].center[0] + " " + response.features[0].center[1] )
      shopLong= response.features[0].center[0]
      shopLat = response.features[0].center[1]
      console.log("Store Name: " + response.features[0].text)
      shopTitle=response.features[0].text
      console.log("Store Address: " + response.features[0].properties.address)
      shopAddress= response.features[0].properties.address
    
      const geojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [shopLong, shopLat]
            },
            properties: {
              title: shopTitle,
              description: shopAddress
            }
          }
        ]
      };

      // add markers to map
for (const { geometry, properties } of geojson.features) {
  // create a HTML element for each feature
  const el = document.createElement('div');
  el.className = 'marker';

  // make a marker for each feature and add to the map
  new mapboxgl.Marker(el).setLngLat(geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML(`<h3>${properties.title}</h3><p>${properties.description}</p>`)
  )
  .addTo(map);
}
})}})