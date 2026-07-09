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
const gallery = document.getElementById('gallery');
const factBox = document.getElementById('fact');
const apiKey = NASA_API_KEY;

const spaceFacts = [
  'Did You Know? A day on Venus is longer than a year on Venus.',
  'Did You Know? Jupiter has a storm larger than Earth that has lasted for hundreds of years.',
  'Did You Know? Saturn could float in water because it is mostly made of gas.',
  'Did You Know? The footprints left by astronauts on the Moon will remain for millions of years because there is no wind to erode them.',
  'Did You Know? The Sun accounts for 99.86% of the mass in our solar system.',
  'Did You Know? A teaspoon of a neutron star would weigh about 6 billion tons on Earth.',
  'Did You Know? The largest volcano in the solar system is Olympus Mons on Mars, which is about 13.6 miles high.',
  'Did You Know? The Milky Way galaxy is estimated to contain over 100 billion stars.',
  'Did You Know? The Hubble Space Telescope has helped scientists discover that the universe is expanding at an accelerating rate.',
  'Did You Know? Black holes can warp space and time, creating gravitational lensing effects that bend light around them.'
];

function showRandomFact() {
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  factBox.textContent = spaceFacts[randomIndex];
}

showRandomFact();

function showPlaceholder(message) {
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🔭</div>
      <p>${message}</p>
    </div>
  `;
}

// Add an Event Listener to the Button
imageBtn.addEventListener('click', function () {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    showPlaceholder('Please choose a start and end date.');
    return;
  }

  if (startDate > endDate) {
    showPlaceholder('Start date must be before or equal to the end date.');
    return;
  }

  showPlaceholder('Loading space images...');

  // Build the NASA APOD API URL using the selected date range
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  fetch(apiUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Unable to load NASA images.');
      }
      return response.json();
    })
    .then(function (photos) {
      gallery.innerHTML = '';

      if (!photos || photos.length === 0) {
        showPlaceholder('No space images were found for that date range.');
        return;
      }

      photos.forEach(function (photo) {
        if (photo.media_type !== 'image') {
          return;
        }

        const card = document.createElement('div');
        card.className = 'gallery-item';

        const image = document.createElement('img');
        image.src = photo.hdurl || photo.url;
        image.alt = photo.title;
        image.loading = 'lazy';

        const overlay = document.createElement('div');
        overlay.className = 'card-overlay';
        overlay.textContent = 'Take a Closer Look';

        const title = document.createElement('h3');
        title.textContent = photo.title;

        const date = document.createElement('p');
        date.textContent = photo.date;

        card.appendChild(image);
        card.appendChild(overlay);
        card.appendChild(title);
        card.appendChild(date);

        card.addEventListener('click', function () {
          const modal = document.createElement('div');
          modal.className = 'modal';

          const modalContent = document.createElement('div');
          modalContent.className = 'modal-content';

          const closeButton = document.createElement('button');
          closeButton.className = 'modal-close';
          closeButton.textContent = '×';

          const modalImage = document.createElement('img');
          modalImage.className = 'modal-image';
          modalImage.src = photo.hdurl || photo.url;
          modalImage.alt = photo.title;

          const modalTitle = document.createElement('h3');
          modalTitle.className = 'modal-title';
          modalTitle.textContent = photo.title;

          const modalText = document.createElement('p');
          modalText.className = 'modal-text';
          modalText.textContent = photo.explanation;

          closeButton.addEventListener('click', function () {
            document.body.removeChild(modal);
          });

          modal.addEventListener('click', function (event) {
            if (event.target === modal) {
              document.body.removeChild(modal);
            }
          });

          modalContent.appendChild(closeButton);
          modalContent.appendChild(modalImage);
          modalContent.appendChild(modalTitle);
          modalContent.appendChild(modalText);
          modal.appendChild(modalContent);
          document.body.appendChild(modal);
        });

        gallery.appendChild(card);
      });
    })
    .catch(function (error) {
      console.error(error);
      showPlaceholder('Something went wrong while loading NASA images.');
    });
});

