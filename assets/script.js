// my api key
const apiKey = '4fd23090c1e761ad98f082183b24aac7';
// ids from HTML
const searchBtn = document.getElementById('search-btn');
const weatherRequest = document.getElementById('weatherRequest');
// when user clicks search the function is called
searchBtn.addEventListener('click', requestWeather);
// Function for current weather in the city the user searched for
function requestWeather(){
    let cityInput = document.getElementById('search-input').value.trim();
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.coord){
            data.coord.forEach(currentWeather => {
                html += `
                    <div>
                    <h2>${cityInput}<h2>
                    <h5>${currentWeather.temp}</h5>
                    <h5>${currentWeather.speed}</h5>
                    <h5>${currentWeather.humidity}</h5>
                    </div>
                `;
            });
            weatherRequest.classList.remove('notFound');
        } else{
            html = "Sorry, we didn't find the weather for your city.";
            weatherRequest.classList.add('notFound');
        }

        weatherRequest.innerHTML = html;
    });
}

fetch('https://api.openweathermap.org/data/2.5/forecast?q=miami&appid=4fd23090c1e761ad98f082183b24aac7')
  .then(response => response.json())
  .then(data => console.log(data));

