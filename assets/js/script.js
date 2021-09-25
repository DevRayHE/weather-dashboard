var weatherData = {};


function handleSearchFormSubmit() {
  //event.preventDefault();

  // let searchInputVal = document.querySelector("#id").value.toLowerCase();
  let city = searchInputVal = "sydney";

  if (!searchInputVal) {
    console.error("You need a search input value!");
    return;
  }

  searchApi(city)
}

// serachFormEl.addEventListener("submit", handleSearchFormSubmit);
function searchApi(city) {
  let APIKey = config.weatherAPIKey;
  let locationQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" 
    + city 
    + "&units=metric&appid=" 
    + APIKey;

  fetchLatAndLon(locationQueryURL, APIKey);
}

function fetchLatAndLon(URL, APIKey) {
  fetch(URL)
    .then(function (response) {
      if(!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (searchRes) {
      let oneCallQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" 
    + searchRes.coord.lat 
    + "&lon=" 
    + searchRes.coord.lon
    + "&exclude=minutely,hourly"
    + "&units=metric&appid=" 
    + APIKey;

    fetchWeatherData(oneCallQueryURL);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function fetchWeatherData(URL) {
  fetch(URL)
    .then(function (response) {
      if(!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (searchRes) {
      weatherData = searchRes;
      console.log(weatherData);
    })
    .catch(function (error) {
      console.log(error);
    });
}

handleSearchFormSubmit()