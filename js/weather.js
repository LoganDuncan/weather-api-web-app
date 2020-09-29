// openweather.js

/* 
FYI >> weather icon url: http://openweathermap.org/img/w/10d.png
Use the data .icon proprty to get the value and then build the complete path to the image
*/

// const api_key = '&APPID=11d39b2f11ef3fd1149b59ed24986c10'
const api_key = '&APPID=ccff5f49e924a67c13612df598211446'
const searchBtn = document.querySelector('#searchbutton')
const searchBtnForecast = document.querySelector('#searchbuttonforecast')
const weather = document.querySelector('#weather')
const searchBox = document.querySelector('#searchbox')

const checkLocation = (forecastOption) => {
    weather.innerHTML = ''
    weather.style.display = 'none'
    let location = searchBox.value
    if (location != '' && location != undefined) {
        if (forecastOption == 'current') {
            getWeather(location)
        } else if (forecastOption == 'forecast')
            getWeatherForecast(location)
    }
}

const isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

const getWeather = (location) => {
    let url = ''
    let output = ''

    if (isNumeric(location)) {
        url = `http://api.openweathermap.org/data/2.5/weather?zip=${location}&units=imperial${api_key}`
    } else {
        url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial${api_key}`
    }

    console.log(url)

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.cod != '404') {
                let icon = data.weather[0].icon
                icon = `<img src="http://openweathermap.org/img/w/${icon}.png"/>`
                output += `<h2>Weather in ${data.name}${icon}</h2>`
                output += `<p>It is currently <strong>${data.main.temp}&#8457</strong> with today's low being <strong>${data.main.temp_min}&#8457</strong> and the high being <strong>${data.main.temp_max}&#8457</strong></p>`
                output += `<p>It feels like: <strong>${data.main.feels_like}&#8457</strong> out there with conditions as follows:</p>`
                output += `<ul>`
                output += `<li>Humidity: ${data.main.humidity}%</li>`
                output += `<li>Air pressure: ${data.main.pressure} hpa</li>`
                output += `<li>Wind speed: ${data.wind.speed}mph at ${data.wind.deg} degrees</li>`
                output += `</ul>`
            } else {
                output = `<p>No weather avaialable for that location. Please try again.</p>`
            }
            weather.style.display = "block"
            weather.innerHTML = output
        })
}

// get weather forecast for a location
const getWeatherForecast = (location) => {
    let url = ''
    let output = ''
    let current_date = ''
    let new_date = ''

    // do we have a location or a zip code?
    if (isNumeric(location)) {
        url = `http://api.openweathermap.org/data/2.5/forecast?zip=${location}&units=imperial${api_key}`
    } else {
        url = `http://api.openweathermap.org/data/2.5/forecast?q=${location}&units=imperial${api_key}`
    }

    console.log(url)

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // show the data you got back from fetch
            console.log(data)
            if (data.cod != '404') {
                // how many days?
                console.log(data.list.length)

                output += `<h2>Forecast for ${data.city.name}</h2>`
                for (let i = 0; i < data.list.length; i++) {
                    current_date = data.list[i].dt_txt.substring(0, 10);
                    if (new_date == '') {
                        new_date = current_date
                        shortDate = moment(data.list[i].dt_txt).format("dddd")
                        output += `<div><h3>${shortDate}</h3></div>`
                    }

                    if (current_date !== new_date) {
                        shortDate = moment(data.list[i].dt_txt).format("dddd")
                        output += `<div><h3>${shortDate}</h3></div>`
                        new_date = current_date
                    }

                    output += `<div class="hourly">`
                    shortTime = moment(data.list[i].dt_txt).format("hh mm a")
                    output += `<div>${shortTime}</div>`
                    output += `<div>Temperature: ${data.list[i].main.temp_min}</div>`
                    output += `<div>Humidity: ${data.list[i].main.humidity}</div>`
                    output += `<div>${data.list[i].weather[0].description}</div>`
                    let icon = data.list[i].weather[0].icon;
                    icon = `<img src="http://openweathermap.org/img/w/${icon}.png" />`
                    output += icon
                    output += `</div>`
                }
            } else {
                output = `<p>No weather avaialable for that location. Please try again.</p>`
            } // end if
            // display results
            weather.style.display = "block"
            weather.innerHTML = output
        })
} // end getWeatherForecast

// Event Listeners
searchBtn.addEventListener('click', () => { checkLocation('current') })
searchBtnForecast.addEventListener('click', () => { checkLocation('forecast') })