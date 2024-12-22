// Initialize the map (worldwide view)
const map = L.map('map').setView([0, 0], 2); // Default view centered at the equator

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Function to fetch data (rainfall/soil moisture) for a specific area and time range
async function fetchData(event) {
  event.preventDefault();

  // Get input values
  const minLat = parseFloat(document.getElementById('minLat').value);
  const maxLat = parseFloat(document.getElementById('maxLat').value);
  const minLon = parseFloat(document.getElementById('minLon').value);
  const maxLon = parseFloat(document.getElementById('maxLon').value);
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  if (
    isNaN(minLat) || isNaN(maxLat) || isNaN(minLon) || isNaN(maxLon) ||
    !startDate || !endDate
  ) {
    alert('Please fill in all fields with valid data.');
    return;
  }

  try {
    // Example API URL (replace with an actual API endpoint)
    const response = await fetch(
      `https://example.com/api/data?minLat=${minLat}&maxLat=${maxLat}&minLon=${minLon}&maxLon=${maxLon}&startDate=${startDate}&endDate=${endDate}`
    );

    if (!response.ok) throw new Error('Failed to fetch data');

    const data = await response.json();

    // Display or process the data (example: log to console)
    console.log('Fetched Data:', data);

    // Offer data as CSV download
    downloadCSV(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Failed to fetch data. Please try again.');
  }
}

// Function to convert JSON data to CSV and download it
function downloadCSV(data) {
  if (!data || data.length === 0) {
    alert('No data available to download.');
    return;
  }

  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(',')); // Add headers

  data.forEach(row => {
    const values = headers.map(header => row[header]);
    csvRows.push(values.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// Add event listener to the form
document.getElementById('dataForm').addEventListener('submit', fetchData);
