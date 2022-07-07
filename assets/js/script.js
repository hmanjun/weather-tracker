var searchHistory = []
if(JSON.parse(localStorage.getItem("weatherHistory"))){ //Check if there is any stored history to grab
    searchHistory = JSON.parse(localStorage.getItem("weatherHistory"))
}
/*Global Variables*/
var infoCont = $(".info-container")
var lon
var lat
var uv
var colorCode
displayHistory() //Load stored previous searches

/*Search button listener*/
$(document).on("click", "#search-btn", function(){ 
    var cityName = $(this).siblings("#city-search-val").val()
    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1) //Captilize first letter
    if(cityName){ //Input validation
        getGeoLocation(cityName) //Call api for lat,lon for city
    }
    
})

/*Listener for search history buttons*/
$(document).on("click", ".history-btn", function(){
    getGeoLocation($(this).attr("data-name"))
})

function addToHistory(name){ //Add input to search history
    if(searchHistory.includes(name)){ //Don't add if already in the list
        return
    }
    if(searchHistory.length > 5){ //Only hold 6 cities in history, pop the oldest
        searchHistory.pop()
    }
    searchHistory.unshift(name)
    localStorage.setItem("weatherHistory", JSON.stringify(searchHistory)) //Store history arr in localstorage
    displayHistory()
}

function displayHistory(){ //Dynamically display search history as button elements
    $("#history-cont").empty()
    for(var i = 0; i < searchHistory.length; i++){
        var histCont = $("#history-cont")
        console.log(searchHistory[i])
        var cityBtn = $("<button>").addClass("btn btn-secondary text-light my-2 history-btn").text(searchHistory[i])
        cityBtn.attr("data-name", searchHistory[i]) //Add city name to element to be used when recalled
        histCont.append(cityBtn)
    }
}

function getWeatherData(name){ //Call for weather data
    var getUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=3279c108edd62f03f66f2e92780c6761"
    
    $.ajax({
        url: getUrl,
        method: "GET"
    })
        .then(function(response){//Call functions after recieving response
            console.log(response)
            addToHistory(name)
            displayCurrentTemp(response, name)
            displayForecastCards(response)
        })
}

function getGeoLocation(name){ //Call api for lat,lon for city
    $.ajax({
        url: "https://api.openweathermap.org/geo/1.0/direct?q=" + name + "&limit=1&appid=410463b3935acea56c8171825dbb4440",
        method: "GET"
    })
        .then(function(response){
            lon = response[0].lon
            lat = response[0].lat
            getWeatherData(name)
        })
        
        .catch(function(){ //Catch case where input is not a real city
            console.log("Input is not a valid city")
        })
}

function colorCodeUV(index){ //Color code UV index based on value
    if(index >= 8){
        colorCode = "bg-danger"
    } else if(index >= 3){
        colorCode = "bg-warning"
    } else {
        colorCode = "bg-success"
    }
}

function displayCurrentTemp(data,name){ //Dynamically create current day weather information card
    $(".info-container").empty()
    var currTempCont = $("<div>").addClass("container d-flex flex-column curr-temp-cont")
    /*Get icon image*/
    var iconUrl = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png"
    var img = $("<img>").attr("src", iconUrl)
    img.attr("alt", "Weather Icon")
    var title = $("<h2>").text(name +" "+ moment().format("[(]M[/]DD[/]YYYY[)]"))
    title.append(img)
    var temp = $("<h5>").text("Temp: " + data.current.temp + " F")
    var winds = $("<h5>").text("Wind: " + data.current.wind_speed + " MPH")
    var humid = $("<h5>").text("Humidity: " + data.current.humidity + "%")
    var uvTitle = $("<h5>").text("UV Index: ").addClass("d-flex flex-row")
    colorCodeUV(data.current.uvi)
    uvTitle.append($("<h5>").text(" "+ data.current.uvi).addClass(colorCode))
    /*Connect generated elements to DOM*/
    currTempCont.append(title, temp, winds, humid, uvTitle)
    infoCont.append(currTempCont)
}

function displayForecastCards(data){//Dynamically create forecast information cards
    var title = $("<h3>").text("5-Day Forecast:").addClass("container")
    var cardCont = $("<div>").addClass("container d-flex flex-row card-cont")
    infoCont.append(title)
    
    for(var i = 0; i < 5; i++){ //Select the next 5 days
        var card = $("<div>").addClass("card").css("width", "18rem")
        var date = $("<h4>").text(moment().add(i+1,'days').format("[(]M[/]DD[/]YYYY[)]"))
        var iconUrl = "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png"
        var img = $("<img>").attr({
            src: iconUrl,
            width: 70,
            height: 70
        })
        var temp = $("<h5>").text("Temp: " + data.daily[i].temp["day"] + " F")
        var winds = $("<h5>").text("Wind: " + data.daily[i].wind_speed + " MPH")
        var humid = $("<h5>").text("Humidity: " + data.daily[i].humidity + "%")
        /*Connect generated elements to DOM*/
        card.append(date, img, temp, winds, humid)
        cardCont.append(card)
    }
    infoCont.append(cardCont)
}
