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

    // Reset form
    document.getElementById('markerForm').reset();
  } else {
    alert('Please enter valid latitude and longitude.');
  }
}

// Function to add a labeled marker with custom icon and label
function addLabeledMarker(lat, lon, label, markerColor) {
  // Add a circle marker
  const circleMarker = L.divIcon({
    className: 'marker-circle',
    iconSize: [20, 20],
    html: `<div style="width: 20px; height: 20px; border-radius: 50%; background-color: ${markerColor}; border: 2px solid #000;"></div>`
  });

  L.marker([lat, lon], { icon: circleMarker }).addTo(map);

  // Add a text label
  const icon = L.divIcon({
    className: 'label',
    html: label,
    iconSize: [50, 20]
  });

  L.marker([lat, lon], { icon: icon }).addTo(map);
}
