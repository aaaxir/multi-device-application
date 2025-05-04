const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Using your provided API Key
const API_KEY = 'cb06052e70219d684d9a28e978968dc7';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    // Added a more detailed user-agent and error handling
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`,
      {
        headers: {
          'User-Agent': 'WeatherApp/1.0'
        }
      }
    );

    // Check if the response is OK before parsing JSON
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenWeatherMap API error:', errorData);
      return res.status(response.status).json({
        error: 'Failed to fetch weather data',
        details: errorData
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from OpenWeatherMap:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});