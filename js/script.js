// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Select the button and gallery container elements from the HTML
const imageBtn = document.getElementById('image-btn');

// Add an Event Listener to the Button
imageBtn.addEventListener('click', function () {
  console.log('Retrieving space images...');
})

// Function to fetch images from NASA API

// Fetch data from the API

