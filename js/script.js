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
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalExplanation = document.getElementById('modal-explanation');
const closeModalBtn = document.getElementById('close-modal');
const apiKey = NASA_API_KEY;

function showPlaceholder(message) {
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🔭</div>
      <p>${message}</p>
    </div>
  `;
}

function openModal(photo) {
  modalImage.src = photo.hdurl || photo.url;
  modalImage.alt = photo.title;
  modalTitle.textContent = photo.title;
  modalExplanation.textContent = photo.explanation;
  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
}

closeModalBtn.addEventListener('click', closeModal);

modal.addEventListener('click', function (event) {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeModal();
  }
});

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

        const title = document.createElement('h3');
        title.textContent = photo.title;

        const date = document.createElement('p');
        date.textContent = photo.date;

        const explanation = document.createElement('p');
        explanation.textContent = photo.explanation;

        const button = document.createElement('button');
        button.className = 'look-closer-btn';
        button.textContent = 'Look Closer';
        button.addEventListener('click', function () {
          openModal(photo);
        });

        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(date);
        card.appendChild(explanation);
        card.appendChild(button);
        gallery.appendChild(card);
      });
    })
    .catch(function (error) {
      console.error(error);
      showPlaceholder('Something went wrong while loading NASA images.');
    });
});

