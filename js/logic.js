var geoJson = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Create a new map, centering over the Salt Lake City Airport to visualize earthquakes on the West Coast and Midwest U.S.
var myMap = L.map("map", {
  center: [
    40.79004113996794, -111.97816943898866
  ],
  zoom: 5,
});

// map layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    }).addTo(myMap);

// d3 for fetching earthquake geoJson data    
d3.json(geoJson).then(data => {
    //console.log(data);
    var earthquakes = data.features;
    //console.log(earthquakes);

  // color scheme from Color Brewer: https://colorbrewer2.org/#type=sequential&scheme=YlGnBu&n=7
  function fillCircleColor(mag) {
      switch (true) {
      case mag > 5: 
        return "#0c2c84";
      case mag > 4: 
        return "#1d91c0";
      case mag > 3: 
        return "#41b6c4";
      case mag > 2:
        return "#7fcdbb";
      case mag > 1: 
        return "#c7e9b4";
      case mag > 0: 
        return "#F4A460";        
    }
  }; 
  
  // function to multiply the magnitude to render circles larger for visibility
  function markerSize(mag) {
    return mag * 4;
  };

    //geoJson earthquake data for rendering circles according to earthquake magnitude
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {        
        return L.circleMarker(latlng, {
          radius: markerSize(feature.properties.mag),
          color: fillCircleColor(feature.properties.mag), 
          fillColor: fillCircleColor(feature.properties.mag),
          fillOpacity: 0.75 
        });
      },
      
      
      //onEachFeature for popup with data from geoJson features
      onEachFeature: function(feature, layer) {
        layer.bindPopup(`
        <h3>${feature.properties.place}</h3>
        <h5>Magnitude: ${feature.properties.mag}</h5>
        `);
      }
    }).addTo(myMap);
  
    // add legend to map
    // https://leafletjs.com/examples/choropleth/
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
      
      var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = ["<b>Magnitude</b>"];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          labels.push('<i style="background:' + fillCircleColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+'));
      }
      div.innerHTML = labels.join("<br>");

      return div;
    };

// add legend to map 
    legend.addTo(myMap);
//closing D3
  });
