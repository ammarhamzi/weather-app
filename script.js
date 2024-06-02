document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "c53b40c01fb23d4d43ab15ddbce6933d";
  const defaultCity = "Sarawak, Malaysia";

  fetchWeatherData(defaultCity);

  updateDateTime();
  setInterval(updateDateTime, 1000);

  const toggleModeBtn = document.getElementById("toggle-mode-btn");
  toggleModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("night-mode");
    document.querySelector(".weather-app").classList.toggle("night-mode");
    toggleModeBtn.classList.toggle("night-mode");
    document.getElementById("search-btn").classList.toggle("night-mode");

    updateToggleButtonText();
  });

  document.getElementById("city-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("search-btn").click();
    }
  });

  document.getElementById("search-btn").addEventListener("click", () => {
    const city = document.getElementById("city-input").value;
    if (city) {
      fetchWeatherData(city);
    } else {
      displayError("Please enter a city name.");
    }
  });

  function fetchWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No data found");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.sys && data.main && data.weather) {
          updateWeather(data);
          clearError();
        } else {
          throw new Error("No data received from the API");
        }
      })
      .catch((error) => {
        displayError("Problem: " + error.message);
      });
  }

  function updateWeather(data) {
    document.getElementById(
      "city"
    ).textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById(
      "temperature"
    ).textContent = `Temperature: ${data.main.temp}°C`;
    document.getElementById(
      "condition"
    ).textContent = `Condition: ${data.weather[0].description}`;
    document.getElementById(
      "weather-icon"
    ).src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  }

  function displayError(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = message;
  }

  function clearError() {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = "";
  }

  function updateToggleButtonText() {
    const isNightMode = document.body.classList.contains("night-mode");
    toggleModeBtn.textContent = isNightMode ? "Light Mode" : "Night Mode";
  }

  function updateDateTime() {
    const dateTimeElement = document.getElementById("date-time");
    const currentDateTime = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const dateString = currentDateTime.toLocaleDateString("en-US", options);
    const timeString = currentDateTime.toLocaleTimeString("en-US");
    dateTimeElement.textContent = `Date: ${dateString}  || Time: ${timeString}`;
  }

  updateToggleButtonText();
});
