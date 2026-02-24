const apiKey = "a700eac9df4b87118777b107dc080d5e";
const city = "London";

const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

axios.get(url)
    .then(function(response) {

        const data = response.data;

        const cityName = data.name;
        const temperature = data.main.temp;
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;

        document.getElementById("city").textContent = cityName;
        document.getElementById("temperature").textContent = temperature + "°C";
        document.getElementById("description").textContent = description;

        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        document.getElementById("icon").src = iconUrl;

    })
    .catch(function(error) {
        console.error("Error fetching weather data:", error);
    });