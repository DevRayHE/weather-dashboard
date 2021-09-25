

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
  let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

  fetch(queryURL)
    .then(function (response) {
      if(!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (searchRes) {
      console.log(searchRes);
    })
    .catch(function (error) {
      console.log(error);
    });
}

handleSearchFormSubmit()