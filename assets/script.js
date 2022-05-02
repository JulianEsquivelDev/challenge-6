// my api key
// const apiKey = '4fd23090c1e761ad98f082183b24aac7';


var cityForm = document.querySelector("#search-form");
var searchInput = document.querySelector("#search-input");
var currentCityName = document.querySelector("#current-city-name");
var currentWeather = document.querySelector("#current-city-weather");
var fiveForecast = document.querySelector("#fiveDay-forecast");
var fiveContainer = document.querySelector("#fiveDay-container");
var weatherHistory = document.querySelector("#weatherRequestHistory");
var cities = [];
// main search handler 
var formHandler = function(event) {
    event.preventDefault();

    var city = searchInput.value.trim();
    if (city) {
        getWeather(city);
        getFiveDayWeather(city);
        cities.unshift({city});
        searchInput.value = "";
    } else {
        alert("Sorry you must enter a valid city")
    }
    saveSearch();
    searchHistory(city);
}
var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};
// function for the current weather in the city the user searched for
var getWeather = function(city){
    var apiKey = "4fd23090c1e761ad98f082183b24aac7"
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiUrl)
    .then(function(response){
        response.json().then(function(data){
           presentWeather(data, city); 
        });
    });
};
// how the current weather is presented using createElement method
var presentWeather = function(weatherInfo, searchedCity){
    currentWeather.textContent = "";
    currentCityName.textContent = searchedCity;

    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment(weatherInfo.dt.value).format("MMM D, YYYY") + ") ";
    currentCityName.appendChild(currentDate);

    var weatherImg = document.createElement("img")
    weatherImg.setAttribute("src", `https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`);
    currentCityName.appendChild(weatherImg);

    var currentTemp = document.createElement("span")
    currentTemp.textContent = 'Temperature: ' + weatherInfo.main.temp + " °F";
    currentTemp.classList = "list-group-item"

    var currentHumidity = document.createElement("span");
    currentHumidity.textContent = "Humidity: " + weatherInfo.main.humidity + " %";
    currentHumidity.classList = "list-group-item"

    var currentWind = document.createElement("span");
    currentWind.textContent = "Wind Speed: " + weatherInfo.wind.speed + " MPH";
    currentWind.classList = "list-group-item"

    currentWeather.appendChild(currentTemp);

    currentWeather.appendChild(currentHumidity);

    currentWeather.appendChild(currentWind);

    var latitude = weatherInfo.coord.lat;
    var longitude = weatherInfo.coord.lon;
    obtainUvIndex(latitude, longitude)
}
// fetch function to get uvIndex
var obtainUvIndex = function(latitude, longitude) {
    var apiKey = "4fd23090c1e761ad98f082183b24aac7"
    var apiUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${latitude}&lon=${longitude}`
    fetch(apiUrl)
    .then(function(response) {
        response.json().then(function(data){
            presentUvIndex(data)
        });
    });
}
// hoe the uvIndex is presented on the dashboard
var presentUvIndex = function(index){
    var currentUv = document.createElement('div');
    currentUv.textContent = "UV Index: "
    currentUv.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <=2){
        uvIndexValue.classList = "favorable"
    } else if (index.value >2 && index.value<=8){
        uvIndexValue.classList = "moderate"
    } else if(index.value >8){
        uvIndexValue.classList = "severe"
    };

    currentUv.appendChild(uvIndexValue);

    currentWeather.appendChild(currentUv);
}
// fetch function to get 5 day forecast
var getFiveDayWeather = function(city){

    var apiKey = "4fd23090c1e761ad98f082183b24aac7"
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiUrl)
    .then(function(response){
        response.json().then(function(data){
            presentFiveDay(data);
        });
    });
};
// how the five day forecast is presented in the dashboard
var presentFiveDay = function(weatherInfo){
    fiveContainer.textContent = ""
    fiveForecast.textContent = "5-Day Forecast:";
    
    // console.log(weatherInfo)
    var forecast = weatherInfo.list;
        for (var i = 5; i < forecast.length; i = i + 8){
            var dailyForecast = forecast[i];

            var fiveDayForecast = document.createElement("div");
            fiveDayForecast.classList = "card bg-primary text-light m-2";

            var fiveDayDate = document.createElement("h5")
            fiveDayDate.textContent = moment.unix(dailyForecast.dt).format("MMM D, YYYY");
            fiveDayDate.classList = "card-header text-center"
            
            var weatherSymbol = document.createElement("img")
            weatherSymbol.classList = "card-body text-center";
            weatherSymbol.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);

            var tempForecast = document.createElement("span");
            tempForecast.classList = "card-body text-center";
            tempForecast.textContent = dailyForecast.main.temp + " °F";

            var humidForecast = document.createElement("span");
            humidForecast.classList = "card-body text-center";
            humidForecast.textContent = dailyForecast.main.humidity + " %";

            fiveDayForecast.appendChild(fiveDayDate);
            fiveDayForecast.appendChild(weatherSymbol);
            fiveDayForecast.appendChild(tempForecast);
            fiveDayForecast.appendChild(humidForecast);

            fiveContainer.appendChild(fiveDayForecast);

        }
}

var searchHistory = function(searchHistory){

    searchCity = document.createElement('button');
    searchCity.textContent = searchHistory;
    searchCity.classList = "d-flex btn-light w-100 p-2";
    searchCity.setAttribute('data-city', searchHistory);
    searchCity.setAttribute('type', "submit");

    weatherHistory.prepend(searchCity);
}

var searchFunction = function(event){
    var city = event.target.getAttribute("data-city")
    if(city) {
        getWeather(city);
        getFiveDayWeather(city);
    }
}


cityForm.addEventListener('submit', formHandler);
weatherHistory.addEventListener("click", searchFunction);











// fetch('https://api.openweathermap.org/data/2.5/forecast?q=miami&appid=4fd23090c1e761ad98f082183b24aac7')
//   .then(response => response.json())
//   .then(data => console.log(data));

