import React, { useState } from "react";
import "./App.css";

const API_KEY = "9977b54e25177bb2f4b7070ec353a02a";

function latLonToTile(lat, lon, zoom) {
  const latRad = (lat * Math.PI) / 180;
  const n = Math.pow(2, zoom);
  const xtile = Math.floor(((lon + 180) / 360) * n);
  const ytile = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  );
  return { xtile, ytile };
}

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
      } else {
        setWeather(null);
        alert("City not found!");
      }
    } catch (err) {
      alert("Error fetching data");
    }
    setLoading(false);
  };

  // If weather exists, calculate tile numbers
  const zoom = 10;
  let mapUrl = null;
  if (weather) {
    const { lat, lon } = weather.coord;
    const { xtile, ytile } = latLonToTile(lat, lon, zoom);
    mapUrl = `https://tile.openstreetmap.org/${zoom}/${xtile}/${ytile}.png`;
  }

  return (
    <div
      className="app"
      style={{
        backgroundImage: mapUrl ? `url(${mapUrl})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="card">
        <h1 className="title">🌤️ Weather App</h1>
        <div className="search">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchWeather();
            }}
          />
          <button onClick={fetchWeather} disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {weather && (
          <div className="weather">
            <h2>
              {weather.name}, {weather.sys.country}
            </h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather-icon"
            />
            <p className="temp">{weather.main.temp}°C</p>
            <p className="desc">{weather.weather[0].description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
