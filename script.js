function WeatherApp(apiKey) {
    this.apiKey = apiKey;

    this.cityInput = document.getElementById("cityInput");
    this.searchBtn = document.getElementById("searchBtn");
    this.loading = document.getElementById("loading");
    this.error = document.getElementById("error");
    this.forecastContainer = document.getElementById("forecast");
    this.recentContainer = document.getElementById("recentSearches");

    this.init();
}

WeatherApp.prototype.init = function () {
    this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
    this.loadLastCity();
    this.renderRecentSearches();
};

WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();

    if (!city) {
        this.error.textContent = "Please enter a city name.";
        return;
    }

    this.saveToLocalStorage(city);
    this.fetchWeather(city);
};

WeatherApp.prototype.saveToLocalStorage = function (city) {

    localStorage.setItem("lastCity", city);

    let searches = JSON.parse(localStorage.getItem("recentCities")) || [];

    searches = searches.filter(c => c.toLowerCase() !== city.toLowerCase());

    searches.unshift(city);

    if (searches.length > 5) {
        searches.pop();
    }

    localStorage.setItem("recentCities", JSON.stringify(searches));
    this.renderRecentSearches();
};

WeatherApp.prototype.loadLastCity = function () {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        this.fetchWeather(lastCity);
    }
};

WeatherApp.prototype.renderRecentSearches = function () {

    this.recentContainer.innerHTML = "";

    const searches = JSON.parse(localStorage.getItem("recentCities")) || [];

    searches.forEach(function (city) {

        const btn = document.createElement("button");
        btn.textContent = city;

        btn.addEventListener("click", function () {
            this.fetchWeather(city);
        }.bind(this));

        this.recentContainer.appendChild(btn);

    }.bind(this));
};

WeatherApp.prototype.fetchWeather = function (city) {

    this.loading.style.display = "block";
    this.error.textContent = "";
    this.forecastContainer.innerHTML = "";

    const currentURL =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;

    const forecastURL =
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

    Promise.all([
        axios.get(currentURL),
        axios.get(forecastURL)
    ])
    .then(function (responses) {

        const currentData = responses[0].data;
        const forecastData = responses[1].data;

        this.displayCurrent(currentData);
        this.displayForecast(forecastData);

        this.loading.style.display = "none";

    }.bind(this))
    .catch(function () {
        this.error.textContent = "City not found.";
        this.loading.style.display = "none";
    }.bind(this));
};

WeatherApp.prototype.displayCurrent = function (data) {
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
        const dayName = date.toLocaleDateString("en-US", {
            weekday: "short"
        });

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