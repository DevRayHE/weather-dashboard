// Display today's date
var dateToday = moment().format("D/M/YYYY");
var dateDisplayEl = document.getElementById("currentDay");
dateDisplayEl.textContent = dateToday;


// To generate elements on HTML and display data
function displayWeatherData(city, weatherData, index) {
  console.log(weatherData);
  console.log(moment().add(index, 'd').format("D/M/YYYY"));
  console.log(weatherData.daily[index].temp.eve);
  console.log(weatherData.daily[index].wind_speed);
  console.log(weatherData.daily[index].humidity);
  console.log(weatherData.daily[index].uvi);
  console.log(weatherData.daily[index].weather[0].icon);

  let cardEl = document.createElement("div");
  let cardHeaderEl = document.createElement("div");
  let cardBody = document.createElement("div");
  cardEl.classList.add('card', 'text-left', 'bg-dark', 'text-light')
  document.querySelector('#displayWeather').append(cardEl);

  cardHeaderEl.classList.add('card-header');
  cardEl.append(cardHeaderEl);
  cardHeaderEl.textContent= moment().add(index, 'd').format("D/M/YYYY");

  cardBody.classList.add('card-body');
  cardEl.append(cardBody);

  let ulEl = document.createElement('ul');
  cardBody.append(ulEl);

  let liTempEl = document.createElement('li');
  liTempEl.textContent = 'Temp: ' + weatherData.daily[index].temp.eve + "°C";
  ulEl.appendChild(liTempEl);
  
  let liWindEl = document.createElement('li');
  liWindEl.textContent = 'Wind: ' + weatherData.daily[index].wind_speed + ' KmPH'; 
  ulEl.appendChild(liWindEl);

  let liHumidEl = document.createElement('li');
  liHumidEl.textContent = 'Humidity: ' + weatherData.daily[index].humidity + ' %';
  ulEl.appendChild(liHumidEl);

  if (index === 0) {

    // Main today card header displays city name and weather icon.
    cardHeaderEl.textContent = city + moment().add(index, 'd').format("D/M/YYYY");
    let iconImageEl = document.createElement('img');
    cardHeaderEl.appendChild(iconImageEl);

    iconImageEl.setAttribute('src', 'http://openweathermap.org/img/wn/' 
      + weatherData.daily[index].weather[0].icon
      + '@2x.png');

    let liUVIEl = document.createElement('li');
    // ulEl.insertBefore(liUVIEl, ulEl.childNodes[0]);
    liUVIEl.textContent = 'UV Index: ' + weatherData.daily[index].uvi;
    // liUVIEl.after(liHumidEl);
    liHumidEl.after(liUVIEl);
  }
  else {
    let liIconEl = document.createElement('li');
    let iconImageEl = document.createElement('img');

    iconImageEl.setAttribute('src', 'http://openweathermap.org/img/wn/' 
      + weatherData.daily[index].weather[0].icon
      + '@2x.png');

    // liIconEl.textContent = weatherData.daily[i].weather[0].icon;
    ulEl.insertBefore(liIconEl, ulEl.childNodes[0]);
    liIconEl.appendChild(iconImageEl);
  }
}

// // To get tomorrow's date
// var tomorrow = moment().add(1, 'd').format("D/M/YYYY");

// let formEl = document.getElementById("searchForm");
// Listen to form submit event
document.getElementById("searchForm").addEventListener("submit", handleSearchFormSubmit);

function handleSearchFormSubmit(event) {
  event.preventDefault();

  // Capture valid user input
  let searchInputVal = document.querySelector("#searchInput").value.toLowerCase();
  let city = searchInputVal;
  console.log(city);

  // Display error message in place holder
  if (!searchInputVal) {
    document.querySelector("#searchInput").setAttribute("placeholder", "Invalid input!");
    return;
  }
  searchApi(city)

  // var currentCard = document.querySelector("#currentCard");
  // currentCard.innerHTML = city + "(" + dateToday + ")";
}

function searchApi(city) {
  let APIKey = config.weatherAPIKey;
  let locationQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" 
    + city 
    + "&units=metric&appid=" 
    + APIKey;

  fetchLatAndLon(city, locationQueryURL, APIKey);
}

function fetchLatAndLon(city, URL, APIKey) {
  fetch(URL)
    .then(function (response) {
      if(!response.ok) {
        throw response.json();
      }
      return response.json();
    }) // Generate url with latitude and longitude of the city to search on onCall API
    .then(function (searchRes) {
      let oneCallQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" 
    + searchRes.coord.lat 
    + "&lon=" 
    + searchRes.coord.lon
    + "&exclude=minutely,hourly"
    + "&units=metric&appid=" 
    + APIKey;

    fetchWeatherData(city, oneCallQueryURL);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function fetchWeatherData(city, URL) {
  fetch(URL)
    .then(function (response) {
      if(!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (searchRes) {
      for (index=0; index<6 ; index++) {
        displayWeatherData(city, searchRes, index);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

// function displayDate() {
//   let dateToday = moment().format("D/M/YYYY");
//   let dateDisplayEl = document.getElementById("currentDay");
//   dateDisplayEl.textContent = dateToday;
// }

// handleSearchFormSubmit();
// displayDate();