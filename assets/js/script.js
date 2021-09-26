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
  let ulEl = document.createElement('ul');
  let iconImageEl = document.createElement('img');

  let date = moment().add(index, 'd').format("D/M/YYYY");
  let temp = weatherData.daily[index].temp.eve + '°C';
  let wind = weatherData.daily[index].wind_speed + ' KmPH';
  let humidity = weatherData.daily[index].humidity + ' %';
  let weatherIcon = weatherData.daily[index].weather[0].icon;
  let UVI = weatherData.daily[index].uvi;

  iconImageEl.setAttribute('src', 'http://openweathermap.org/img/wn/' 
        + weatherIcon
        + '@2x.png');

  cardEl.classList.add('card', 'text-left', 'bg-dark', 'text-light');
  ulEl.classList.add('list-group', 'list-group-flush');
  cardEl.append(ulEl);


  for (i=0; i <5; i++) {
    ulEl.append(document.createElement('li'));
  }

  if (index === 0) {
    document.querySelector('#displayWeather').append(cardEl);
    cardEl.setAttribute('id', 'day' + index);

    let allLiEl = document.querySelectorAll('li');
    console.log(allLiEl);
    allLiEl[0].textContent = city + " " + date;
    allLiEl[0].classList.add('h2');
    allLiEl[0].appendChild(iconImageEl);
    allLiEl[1].textContent = 'Temp: ' + temp;
    allLiEl[2].textContent = 'Wind: ' + wind;
    allLiEl[3].textContent = 'Humidity: ' + humidity;
    allLiEl[4].textContent = 'UV Index: ' + UVI;

    let cardGroup = document.createElement('div');
    document.querySelector('#' + 'day' + index).append(cardGroup);
    cardGroup.classList.add('card-group');

  }
  else {
    // cardEl.classList.add("col-3");

    document.querySelector('.card-group').append(cardEl);
    cardEl.setAttribute('id', 'day' + index);

    let allLiEl = document.querySelectorAll('#' + 'day' + index + ' li');
    console.log(allLiEl);
    allLiEl[0].textContent = city + " " + date;
    allLiEl[0].classList.add('h2');
    allLiEl[0].appendChild(iconImageEl);
    allLiEl[1].textContent = 'Temp: ' + temp;
    allLiEl[2].textContent = 'Wind: ' + wind;
    allLiEl[3].textContent = 'Humidity: ' + humidity;
    allLiEl[4].textContent = 'UV Index: ' + UVI;

  }

  let allLiEl = document.querySelectorAll('li');
  allLiEl.forEach(function(el) {
    console.log(el);
    el.classList.add('list-group-item');
  })
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