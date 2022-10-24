/* eslint-disable */

const mapbox = document.getElementById("map");
const locations = JSON.parse(mapbox.dataset.locations);

const displayPopups = (locations) => {
  if (!locations.length) return;

  //   1) create map
  mapboxgl.accessToken =
    "pk.eyJ1IjoibW1sb2thczkwIiwiYSI6ImNsOWthcTcycjAwZG8zbm02dmhrNndhMHIifQ.Gl7j5Fio_2cWomP83Chykg";

  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mmlokas90/cl9kadywn003a14mecvqepwk1", // style URL
    scrollZoom: false, //disabel scroll zoom
    // center: locations[0].coordinates, // starting position [lng, lat]
    // zoom: 9, // starting zoom
    // projection: "globe", // display the map as a 3D globe
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((location, index) => {
    // 1) create marker custom element
    const el = document.createElement("div");
    el.className = "marker";

    // 2) create mapbox marker
    const marker = new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(location.coordinates)
      .setPopup(
        new mapboxgl.Popup().setHTML(
          `<h4>Day ${index + 1}</h4><p>${location.description}</p>`
        )
      )
      .addTo(map);

    // add current location to bound object
    bounds.extend(location.coordinates);
  });

  //3) map fit based on bound obj
  map.fitBounds(bounds, {
    padding: { top: 150, bottom: 150, left: 100, right: 100 },
  });
};

displayPopups(locations);
