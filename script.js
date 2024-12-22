// Initialize the map
const map = L.map('map').setView([37.7749, -122.4194], 13); // Default view centered at San Francisco

// Add OSM tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Function to add a custom marker
function addCustomMarker(event) {
  event.preventDefault();

  // Get form values
  const lat = parseFloat(document.getElementById('lat').value);
  const lon = parseFloat(document.getElementById('lon').value);
  const label = document.getElementById('label').value;
  const markerColor = document.getElementById('markerColor').value;
  if (!isNaN(lat) && !isNaN(lon)) {
    // Add custom marker
    addLabeledMarker(lat, lon, label, markerColor);
    // Save marker data to local storage
    saveMarkerToLocalStorage(lat, lon, label, markerColor);
    // Automatically zoom to the marker
    map.setView([lat, lon], 15); // Adjust zoom level as needed
    // Reset form
    document.getElementById('markerForm').reset();
    // Check location type based on color (example function)
    checkLocationType(lat, lon);
  } else {
    alert('Please enter valid latitude and longitude.');
  }
}

// Function to add a labeled marker with custom icon and label
function addLabeledMarker(lat, lon, label, markerColor) {
  // Add a circle marker
  const circleMarker = L.divIcon({
    className: 'marker-circle',
    html: `<div style="width: 20px; height: 20px; border-radius: 50%; background-color: ${markerColor}; border: 2px solid #000;"></div>`,
    iconSize: [20, 20]
  });

  const marker = L.marker([lat, lon], { icon: circleMarker }).addTo(map);

  // Add a text label
  const icon = L.divIcon({
    className: 'label',
    html: label,
    iconSize: null // auto-size based on content
  });
  L.marker([lat, lon], { icon: icon }).addTo(map);
  // Store marker reference for removal later if needed
  marker.markerId = generateMarkerId(lat, lon);
}
// Function to generate a unique marker ID based on lat and lon
function generateMarkerId(lat, lon) {
  return `${lat.toFixed(6)}_${lon.toFixed(6)}`;
}

// Function to save marker data to local storage
function saveMarkerToLocalStorage(lat, lon, label, markerColor) {
  const markers = JSON.parse(localStorage.getItem('markers')) || [];

  // Check if marker already exists
  const existingMarker = markers.find(marker => marker.lat === lat && marker.lon === lon);
  if (!existingMarker) {
    markers.push({ lat, lon, label, markerColor });
    localStorage.setItem('markers', JSON.stringify(markers));
  }
}

// Function to load markers from local storage and add to the map
function loadMarkersFromLocalStorage() {
  const markers = JSON.parse(localStorage.getItem('markers')) || [];
  markers.forEach(marker => {
    addLabeledMarker(marker.lat, marker.lon, marker.label, marker.markerColor);
  });
}
// Example function to check location type based on map layer color
function checkLocationType(lat, lon) {
  // Convert LatLng to pixel coordinates on the map
  const point = map.latLngToContainerPoint([lat, lon]);
  const x = Math.floor(point.x);
  const y = Math.floor(point.y);
  // Get the map tile layer at the current zoom level
  const tileLayer = map._layers[L.stamp(map._layers)];
  const tiles = tileLayer._tiles;
  // Find the tile containing the specified point
  let tileUrl;
  for (const key in tiles) {
    const tile = tiles[key];
    if (tile && tile.containsPoint({ x: x, y: y })) {
      tileUrl = tile.src;
      break;
    }
  }

  if (tileUrl) {
    // Use an image element to get pixel data (cross-origin security issues may arise)
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Get pixel data at the specified coordinates
      const pixelData = ctx.getImageData(x, y, 1, 1).data;
      const color = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;

      // Determine location type based on color
      determineLocationType(color);
    };
    img.src = tileUrl;
  }
}

// Example function to determine location type based on color
function determineLocationType(color) {
  // Example logic to determine location type based on color
  console.log('Color detected:', color);
  // Implement your logic here based on color values
}

// Load markers from local storage on page load
window.addEventListener('load', loadMarkersFromLocalStorage);
// Handle form submission
const markerForm = document.getElementById('markerForm');
markerForm.addEventListener('submit', addCustomMarker);
// Export map as PNG
const exportMapButton = document.getElementById('exportMap');
exportMapButton.addEventListener('click', function() {
  // Use html2canvas library to capture map as an image
  html2canvas(document.getElementById('map')).then(function(canvas) {
    // Convert canvas to image URL
    const imgData = canvas.toDataURL('image/png');
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'map.png';
    link.click();
  });
});
