// Display today's date
var dateToday = moment().format('D/M/YYYY');
// var dateDisplayEl = document.getElementById('currentDay');
// dateDisplayEl.textContent = dateToday;
var searchData = [];


// To generate elements on HTML and display data
function displayWeatherData(city, weatherData, index) {
  
  // Reset the page if weather data is present.
  if (document.querySelector('#day5')) {
    document.querySelector('#displayWeather').innerText = '';
  }
  
  let cityName = city.charAt(0).toUpperCase() + city.slice(1);
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

  // Display weather on main card for today
  if (index === 0) {
    document.querySelector('#displayWeather').append(cardEl);
    cardEl.setAttribute('id', 'day' + index);
    cardEl.classList.add('border-1');

    let allLiEl = document.querySelectorAll('#displayWeather li');
    allLiEl[0].textContent = cityName + " " + date;
    allLiEl[0].classList.add('display-4', 'fw-bold');
    allLiEl[0].appendChild(iconImageEl);
    allLiEl[1].textContent = 'Temp: ' + temp;
    allLiEl[2].textContent = 'Wind: ' + wind;
    allLiEl[3].textContent = 'Humidity: ' + humidity;
    allLiEl[4].textContent = 'UV Index: ' + UVI;

    let cardGroupHeader = document.createElement('span')
    let cardGroup = document.createElement('div');
    document.querySelector('#' + 'day' + index).append(cardGroupHeader);
    document.querySelector('#' + 'day' + index).append(cardGroup);
    cardGroupHeader.textContent = '5-Day Forecast: ';
    cardGroupHeader.classList.add('h4','mt-3');
    cardGroup.classList.add('card-group');
  }
  // Display weather on card group for next 5 days
  else {
    document.querySelector('.card-group').append(cardEl);
    cardEl.setAttribute('id', 'day' + index);
    cardEl.classList.add('m-2');

    let allLiEl = document.querySelectorAll('#' + 'day' + index + ' li');
    allLiEl[0].textContent = date;
    allLiEl[0].classList.add('fw-bold');
    allLiEl[1].appendChild(iconImageEl);
    allLiEl[2].textContent = 'Temp: ' + temp;
    allLiEl[3].textContent = 'Wind: ' + wind;
    allLiEl[4].textContent = 'Humidity: ' + humidity;
  }

  let allLiEl = document.querySelectorAll('li');
  allLiEl.forEach(function(el) {
    el.classList.add('list-group-item', 'border-0');
  })
}

// let formEl = document.getElementById("searchForm");
// Listen to form submit event
document.getElementById('searchForm').addEventListener('submit', handleSearchFormSubmit);

function displayHistory(data) {

  if (document.querySelector('.historyCard')) {
    let oldCard = document.querySelector('#searchCard .historyCard');
    oldCard.remove();
  }

  //Create new card with list-group
  let historyCard = document.createElement('div');
  let historyCardUl = document.createElement('ul');
  let searchCard = document.querySelector('#searchCard');

  historyCard.classList.add('card', 'historyCard');
  historyCardUl.classList.add('list-group', 'list-group-flush'); 
  historyCard.append(historyCardUl)
  searchCard.append(historyCard);
 
  for (i=0; i<data.length; i++) {
    let liEL = document.createElement('li');
    let btnEl = document.createElement('button');
    historyCardUl.append(liEL);
    liEL.append(btnEl);
    liEL.classList.add('m-1', 'p1');
    btnEl.classList.add('btn', 'btn-primary', 'm-1');
    btnEl.textContent = data[i];
  }
}

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

  // Local storage has search history data, then get the data
  if(localStorage.getItem('searchHistory')) {
    searchData = localStorage.getItem('searchHistory').split(',');
    if(!(searchData.includes(city))) {
      searchData.push(city);
      searchData.sort();
      localStorage.setItem('searchHistory', searchData);
    }
  } // When local storage has no search data 
  else {
    searchData.push(city);
    localStorage.setItem('searchHistory', searchData);
  }

  displayHistory(searchData);
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

    console.log(locationQueryURL);

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