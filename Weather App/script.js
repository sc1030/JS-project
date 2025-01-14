const apiKey = "b1727bd4bed4cc2820d71a73657c5147"; // Replace with your OpenWeather API key

const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector("#search-btn");
const errorDiv = document.querySelector(".error");
const weatherDiv = document.querySelector(".weather");
const tempElement = document.querySelector(".temp");
const cityElement = document.querySelector(".city");
const humidityElement = document.querySelector(".humidity");
const windElement = document.querySelector(".wind");
const weatherIcon = document.querySelector(".weather-icon");
const sunriseElement = document.querySelector(".sunrise p");
const sunsetElement = document.querySelector(".sunset p");
const forecastContainer = document.querySelector(".forecast");
const unitButtons = document.querySelectorAll(".unit-toggle button");
let isCelsius = true;

async function fetchWeather(city) {
    try {
        const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        displayWeather(data);
        fetchForecast(city);
        errorDiv.style.display = "none";
        weatherDiv.classList.add("active");
    } catch (error) {
        errorDiv.style.display = "block";
        weatherDiv.classList.remove("active");
    }
}

async function fetchForecast(city) {
    try {
        const response = await fetch(`${forecastUrl}${city}&appid=${apiKey}`);
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error("Error fetching forecast data:", error);
    }
}

function displayWeather(data) {
    tempElement.textContent = isCelsius
        ? `${Math.round(data.main.temp)}°C`
        : `${Math.round(data.main.temp * 9 / 5 + 32)}°F`;
    cityElement.textContent = data.name;
    humidityElement.textContent = `${data.main.humidity}%`;
    windElement.textContent = `${data.wind.speed} km/h`;

    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);
    sunriseElement.textContent = formatTime(sunrise);
    sunsetElement.textContent = formatTime(sunset);
}

function displayForecast(data) {
    forecastContainer.innerHTML = ""; // Clear previous forecast
    const dailyForecasts = getDailyForecasts(data);
    dailyForecasts.forEach(day => {
        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecast-item");
        forecastItem.innerHTML = `
            <h3>${formatDate(day.date)}</h3>
            <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.description}">
            <p>${Math.round(day.temp)}°C</p>
        `;
        forecastContainer.appendChild(forecastItem);
    });
}

function getDailyForecasts(data) {
    const daily = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toISOString().split("T")[0];
        if (!daily[day]) {
            daily[day] = {
                temp: item.main.temp,
                icon: item.weather[0].icon,
                description: item.weather[0].description,
                date,
            };
        }
    });
    return Object.values(daily).slice(0, 5); // Get 5 days
}

function formatDate(date) {
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}

function formatTime(date) {
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function toggleUnits() {
    isCelsius = !isCelsius;
    unitButtons.forEach(btn => btn.classList.toggle("active"));
    const city = cityElement.textContent;
    if (city) fetchWeather(city);
}

searchBtn.addEventListener("click", () => {
    const city = searchBox.value.trim();
    if (city) fetchWeather(city);
});

searchBox.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        const city = searchBox.value.trim();
        if (city) fetchWeather(city);
    }
});

unitButtons.forEach(button => {
    button.addEventListener("click", toggleUnits);
});

const themeBtn = document.querySelector(".theme-btn");
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
});

