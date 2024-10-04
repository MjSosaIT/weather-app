const apiKey = '341160b64d681afdff80959099da27a7'; // Replace with your OpenWeatherMap API key

// Add event listener to the "Get Weather" button
document.getElementById('getWeather').addEventListener('click', function() {
    const city = document.getElementById('city').value;
    if (city) {
        getWeather(city);
    }
});

// Add event listener to the "Get Current Location Weather" button
document.getElementById('getCurrentLocationWeather').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoordinates(latitude, longitude);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

// Function to fetch weather using city name
function getWeather(city) {
    document.getElementById('loader').style.display = 'block'; // Show loader
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('loader').style.display = 'none'; // Hide loader
            displayWeather(data);
        })
        .catch(error => {
            document.getElementById('loader').style.display = 'none'; // Hide loader
            document.getElementById('weatherResult').innerHTML = `<p>${error.message}</p>`;
        });
}

// Function to fetch weather using coordinates
function fetchWeatherByCoordinates(lat, lon) {
    document.getElementById('loader').style.display = 'block'; // Show loader
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('loader').style.display = 'none'; // Hide loader
            displayWeather(data);
        })
        .catch(error => {
            document.getElementById('loader').style.display = 'none'; // Hide loader
            document.getElementById('weatherResult').innerHTML = `<p>${error.message}</p>`;
        });
}

// Function to display weather data on the webpage
function displayWeather(data) {
    const weatherResult = document.getElementById('weatherResult');
    let weatherCondition = data.weather[0].main.toLowerCase();

    // Change background color based on weather condition
    if (weatherCondition.includes("clear")) {
        document.body.style.backgroundColor = "#f7dc6f"; // Sunny (Yellow)
    } else if (weatherCondition.includes("clouds")) {
        document.body.style.backgroundColor = "#d5dbdb"; // Cloudy (Gray)
    } else if (weatherCondition.includes("rain") || weatherCondition.includes("drizzle")) {
        document.body.style.backgroundColor = "#5dade2"; // Rainy (Blue)
    } else if (weatherCondition.includes("thunderstorm")) {
        document.body.style.backgroundColor = "#34495e"; // Thunderstorm (Dark Gray)
    } else if (weatherCondition.includes("snow")) {
        document.body.style.backgroundColor = "#f2f4f4"; // Snow (Light Gray)
    } else {
        document.body.style.backgroundColor = "#f0f0f0"; // Default Background
    }

    weatherResult.innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Pressure: ${data.main.pressure} hPa</p>
        <p>Visibility: ${data.visibility / 1000} km</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="weather icon">
    `;
}
