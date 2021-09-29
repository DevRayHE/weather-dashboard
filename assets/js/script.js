// Display today's date
var dateToday = moment().format('D/M/YYYY');
// var dateDisplayEl = document.getElementById('currentDay');
// dateDisplayEl.textContent = dateToday;
var searchData = [];

// Listen to form submit event
document.getElementById('searchForm').addEventListener('submit', handleSearchFormSubmit);


// To generate elements on HTML and display data
function displayWeatherData(city, weatherData, index) {
  
  displayHistory(searchData);

  // Reset the page if weather data is present.
  if (document.querySelector('#day5')) {
    document.querySelector('#displayWeather').innerText = '';
  } else if (document.querySelector('#displayWeather #errMsg')) {
    document.querySelector('#errMsg').remove();
  }
  
  if (city = 'userGeolocation') {
    city = '';
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

    let iEl = document.createElement('i');
    allLiEl[4].textContent = 'UV Index: ';
    allLiEl[4].appendChild(iEl);
    iEl.textContent = UVI;
    UVIndexScale(UVI);

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

function UVIndexScale(UVI) {
  let iEl = document.querySelector('i');
  if (UVI <= 2) {
    iEl.classList.add('bg-green', 'p-1');
  }
  else if (2 < UVI && UVI <= 5) {
    iEl.classList.add('bg-yellow', 'p-1');
  }
  else if (5 < UVI && UVI < 8) {
    iEl.classList.add('bg-orange', 'p-1');
  }
  else if (8 <= UVI && UVI < 11) {
    iEl.classList.add('bg-red', 'p-1');
  }
  else {
    iEl.classList.add('bg-purple', 'p-1');
  }
}

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
    btnEl.classList.add('btn', 'btn-primary', 'm-1', 'historyBtn');
    btnEl.textContent = data[i];
  }

  //Listen to click event on history item button
  let searchBtnElAll = document.querySelectorAll('.historyBtn');
  searchBtnElAll.forEach(function(searchBtnElEach) {
    console.log(searchBtnElEach.textContent);
    searchBtnElEach.addEventListener('click', btnSearchApi);
  })

  //Call the searchApi function with content of button(city name) as parameter
  function btnSearchApi(event) {
    searchApi(event.target.textContent);
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

  document.querySelector("#searchInput").setAttribute("placeholder", "city name");
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
      displayErrMsg('Invalid search, try again!');
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
      // Check storage status before getitem, avoid error
      // Local storage has search history data, then get the data
      if(localStorage.getItem('searchHistory')) {
        searchData = localStorage.getItem('searchHistory').split(',');
        if(!(searchData.includes(city))) {
          searchData.push(city);
          searchData.sort();
          localStorage.setItem('searchHistory', searchData);
        }
      } // When local storage has no search data 
      else if (city !== undefined){
        searchData.push(city);
        localStorage.setItem('searchHistory', searchData);
      }

      for (index=0; index<6 ; index++) {
        displayWeatherData(city, searchRes, index);
      }
    })
    .catch(function (error) {
      displayErrMsg('Invalid search, try again!');
      console.log(error);
    });
}

function displayErrMsg(error) {
  document.querySelector('#displayWeather').innerHTML = '';
  let errEl = document.createElement('div');
  document.querySelector('#displayWeather').append(errEl);
  // errEl.appendTo(document.querySelector('#displayWeather'));
  errEl.textContent = error;
  errEl.classList.add('display-7', 'mt-5', 'text-center');
  errEl.setAttribute('id','errMsg')
}

// Initial function, to get user geolocation to display weather at current location, included error handling.
function init() {
  if (navigator.geolocation) {
    console.log(navigator.geolocation.getCurrentPosition(showPosition, showError));
  }

  function showPosition(position) {
    let APIKey = config.weatherAPIKey;
    let userLat = position.coords.latitude;
    let userLon = position.coords.longitude;

    let oneCallQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" 
    + userLat
    + "&lon=" 
    + userLon
    + "&exclude=minutely,hourly"
    + "&units=metric&appid=" 
    + APIKey;

    fetchWeatherData(undefined, oneCallQueryURL)
  }

  //Geolocation error handling
  function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        displayErrMsg ('User denied the request for Geolocation.');
        break;
      case error.POSITION_UNAVAILABLE:
        displayErrMsg ('Location information is unavailable.');
        break;
      case error.TIMEOUT:
        displayErrMsg ('The request to get user location timed out.');
        break;
      case error.UNKNOWN_ERROR:
        displayErrMsg ('An unknown error occurred.');
        break;
    }
  }
}

init();