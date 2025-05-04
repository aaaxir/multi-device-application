const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');

// Also trigger search on Enter key
cityInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    searchWeather();
  }
});

searchBtn.addEventListener('click', searchWeather);

async function searchWeather() {
  // Show loading state
  weatherResult.innerHTML = '<p>Loading...</p>';

  const city = cityInput.value.trim();
  if (city === '') {
    alert('Please enter a city name.');
    return;
  }

  try {
    const response = await fetch(`/weather?city=${encodeURIComponent(city)}`);
    const data = await response.json();

    // Check for error responses
    if (response.status !== 200 || data.cod !== 200) {
      weatherResult.innerHTML = `<p>City not found or API error. Please try again.</p>`;
      console.error('API error:', data);
      return;
    }

    // Format temperature to 1 decimal place
    const temp = data.main.temp.toFixed(1);

    // Make weather description first letter uppercase
    const description = data.weather[0].description
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    weatherResult.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <div class="weather-icon">
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${description}">
      </div>
      <div class="weather-info">
        <p class="description">${description}</p>
        <p class="temperature">${temp}°C</p>
        <p class="details">Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} m/s</p>
      </div>
    `;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    weatherResult.innerHTML = `<p>Error fetching data. Please try again later.</p>`;
  }
}