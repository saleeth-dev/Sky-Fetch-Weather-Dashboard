function WeatherApp(apiKey) {
    this.apiKey = apiKey;
    this.cityInput = document.getElementById("cityInput");
    this.searchBtn = document.getElementById("searchBtn");
    this.loading = document.getElementById("loading");
    this.error = document.getElementById("error");
    this.forecastContainer = document.getElementById("forecast");

    this.init();
}

WeatherApp.prototype.init = function () {
    this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
};

WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();

    if (!city) {
        this.error.textContent = "Please enter a city name.";
        return;
    }

    this.fetchWeatherData(city);
};

WeatherApp.prototype.fetchWeatherData = function (city) {
    this.loading.style.display = "block";
    this.error.textContent = "";
    this.forecastContainer.innerHTML = "";

    const currentUrl =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;

    const forecastUrl =
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

    Promise.all([
        axios.get(currentUrl),
        axios.get(forecastUrl)
    ])
    .then(function (responses) {
        const currentData = responses[0].data;
        const forecastData = responses[1].data;

        this.displayCurrentWeather(currentData);
        this.displayForecast(forecastData);

        this.loading.style.display = "none";
    }.bind(this))
    .catch(function () {
        this.error.textContent = "City not found. Please try again.";
        this.loading.style.display = "none";
    }.bind(this));
};

WeatherApp.prototype.displayCurrentWeather = function (data) {
    document.getElementById("city").textContent = data.name;
    document.getElementById("temperature").textContent =
        "Temperature: " + data.main.temp + "°C";
    document.getElementById("description").textContent =
        data.weather[0].description;

    document.getElementById("icon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
};

WeatherApp.prototype.displayForecast = function (data) {
    const dailyData = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    dailyData.slice(0, 5).forEach(function (day) {

        const date = new Date(day.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

        const card = document.createElement("div");
        card.classList.add("forecast-card");

        card.innerHTML = `
            <p>${dayName}</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
            <p>${day.main.temp}°C</p>
            <p>${day.weather[0].description}</p>
        `;

        this.forecastContainer.appendChild(card);

    }.bind(this));
};

new WeatherApp("YOUR_API_KEY");