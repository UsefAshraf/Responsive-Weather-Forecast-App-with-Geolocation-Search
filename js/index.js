const today = document.querySelector(".today");
const tomorrow = document.querySelector(".tomorrow");
const dayAfterTomorrow = document.querySelector(".day-after-tomorrow");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("submit");

const API_KEY = "8f59f4f56b5b4a06b1d101706241104";

function getWindFullName(dir) {
  const directions = {
    N: "North", NNE: "North-Northeast", NE: "Northeast", ENE: "East-Northeast",
    E: "East", ESE: "East-Southeast", SE: "Southeast", SSE: "South-Southeast",
    S: "South", SSW: "South-Southwest", SW: "Southwest", WSW: "West-Southwest",
    W: "West", WNW: "West-Northwest", NW: "Northwest", NNW: "North-Northwest"
  };
  return directions[dir] || dir;
}
function formatDateToDayMonth(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate(); // returns the day (1–31)
  const month = date.toLocaleString("en-US", { month: "long" }); // returns full month name
  return `${day} ${month}`;
}
function fetchWeather(query) {
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=3`)
    .then(res => res.json())
    .then(data => displayWeather(data))
    .catch(err => console.error("Error fetching weather:", err));
}

function displayWeather(data) {
  const [day1, day2, day3] = data.forecast.forecastday;
  const getDayName = date => new Date(date).toLocaleDateString("en-US", { weekday: "long" });

  today.innerHTML = `
    <div class="forecast-header">
      <div class="day">${getDayName(day1.date)}</div>
      <div class="date">${formatDateToDayMonth(day1.date)}</div>
    </div>
    <div class="forecast-content">
      <div class="location">${data.location.name}</div>
      <div class="degree">
        <div class="num">${data.current.temp_c}<sup>o</sup>C</div>
        <div class="forecast-icon">
          <img src="https:${data.current.condition.icon}" alt="" width="90" />
        </div>
      </div>
      <div class="custom">${data.current.condition.text}</div>
      <span><img src="https://routeweather.netlify.app/images/icon-umberella@2x.png" width="21" height="21" />${
        data.forecast.forecastday[0].hour[new Date().getHours()].cloud
      }%</span>
      <span><img src="https://routeweather.netlify.app/images/icon-wind@2x.png" width="23" height="21" />${
        data.current.wind_kph
      }km/h</span>
      <span><img src="https://routeweather.netlify.app/images/icon-compass@2x.png" width="21" height="21" />${getWindFullName(
        data.current.wind_dir
      )}</span>
    </div>
  `;

  tomorrow.innerHTML = `
    <div class="forecast-header">
      <div class="day">${getDayName(day2.date)}</div>
    </div>
    <div class="forecast-content">
      <div class="forecast-icon">
        <img src="https:${day2.day.condition.icon}" alt="" width="48" />
      </div>
      <div class="degree">${day2.day.maxtemp_c}<sup>o</sup>C</div>
      <small>${day2.day.mintemp_c}<sup>o</sup></small>
      <div class="custom">${day2.day.condition.text}</div>
    </div>
  `;

  dayAfterTomorrow.innerHTML = `
    <div class="forecast-header">
      <div class="day">${getDayName(day3.date)}</div>
    </div>
    <div class="forecast-content">
      <div class="forecast-icon">
        <img src="https:${day3.day.condition.icon}" alt="" width="48" />
      </div>
      <div class="degree">${day3.day.maxtemp_c}<sup>o</sup>C</div>
      <small>${day3.day.mintemp_c}<sup>o</sup></small>
      <div class="custom">${day3.day.condition.text}</div>
    </div>
  `;
}

// Load weather on page load: Use geolocation if possible, else default to Cairo
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
        fetchWeather(coords);
      },
      () => fetchWeather("Cairo") // ✅ DEFAULT = Cairo
    );
  } else {
    fetchWeather("Cairo"); // ✅ DEFAULT = Cairo
  }
});

// Search button handler
searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) fetchWeather(city);
});
