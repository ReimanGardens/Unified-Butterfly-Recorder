import config from "config";

export const OpenWeather = () => new Promise(
    (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
        async position => {
            let lat = position.coords.latitude
            let lon = position.coords.longitude
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.openWeatherApiKey}`);
            const data = await res.json();
            var api_weather_obj = {
                feels_like: data.main.feels_like,
                mainTemp: data.main.temp,
                lon: lat,
                lat: lon,
                sunrise: data.sys.sunrise,
                sunset: data.sys.sunset,
                closestWeatherStation: "not sure how to find this",
                Humidity: data.main.humidity,
                cloudCover: data.clouds.all,
                windSpeed: data.wind.speed,
                windDirection: data.wind.deg,
                Pressure: data.main.pressure
            };
            resolve(api_weather_obj); // Resolve with location. location can now be accessed in the .then method.
        },
        err => reject(err) // Reject with err. err can now be accessed in the .catch method.
      );
    }
);