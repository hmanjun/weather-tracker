var searchHistory = []
var infoCont = $(".info-container")
var lon
var lat
var uv

$(document).on("click", "#search-btn", function(event){
    var cityName = $(this).siblings("#city-search-val").val()
    getWeatherData(cityName)

})

function addToHistory(name){
    if(searchHistory.includes(name)){
        return
    }
    console.log("reached funct")
    searchHistory.unshift(name)
    var histCont = $("#history-cont")
    var cityBtn = $("<button>").addClass("btn btn-secondary text-light my-2").text(name)
    histCont.append(cityBtn)
}

function getWeatherData(name){
    var getUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + name + "&units=imperial&appid=410463b3935acea56c8171825dbb4440"
    //var getUrl = "https://api.openweathermap.org/data/2.5/onecall?q="+name+"&exclude=hourly&units=imperial&appid=410463b3935acea56c8171825dbb4440"
    //var getUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=410463b3935acea56c8171825dbb4440"
    getGeoLocation(name)
    
    $.ajax({
        url: getUrl,
        method: "GET"
    })
        .then(function(response){
            console.log(lon,lat)
            console.log(response)
            //getUV(name)
            addToHistory(name)
            console.log(response.list[0].main["temp"])
            console.log(response.list[0].dt_txt)
            displayCurrentTemp(response)
            displayForecastCards(response)
        })
}

function getGeoLocation(name){
    $.ajax({
        url: "https://api.openweathermap.org/geo/1.0/direct?q=" + name + "&limit=1&appid=410463b3935acea56c8171825dbb4440",
        method: "GET"
    })
        .then(function(response){
            console.log("geo loc", response)
            lon = response[0].lon
            lat = response[0].lat
            getUV()
        })
}

function getUV(){
    console.log(lat, lon)
    var getUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=3279c108edd62f03f66f2e92780c6761"
    $.ajax({
        url: getUrl,
        method: "GET"
    })
        .then(function(response){
            console.log("UV data", response)
            uv = response.current.uvi
        })
}

function displayCurrentTemp(data){
    var currTempCont = $("<div>").addClass("container d-flex flex-column")
    var iconUrl = "http://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png"
    var img = $("<img>").attr("src", iconUrl)
    img.attr("alt", "Weather Icon")
    var title = $("<h2>").text(data.city["name"] +" "+ moment(data.list[0].dt_txt).format("[(]D[/]MM[/]YYYY[)]"))
    title.append(img)
    var temp = $("<h5>").text("Temp: " + data.list[0].main["temp"] + " F")
    var winds = $("<h5>").text("Wind: " + data.list[0].wind.speed + " MPH")
    var humid = $("<h5>").text("Humidity: " + data.list[0].main["temp"] + "%")
    currTempCont.append(title, temp, winds, humid)
    infoCont.append(currTempCont)
    console.log(data.city["name"] + moment(data.list[0].dt_txt).format("[(]D[/]MM[/]YYYY[)]"))
    //data.list[0].weather[0].icon
}

function displayForecastCards(data){
    var title = $("<h3>").text("5-Day Forecast:").addClass("container")
    var cardCont = $("<div>").addClass("container d-flex flex-row")
    infoCont.append(title)
    
    for(var i = 1; i <= 5; i++){
        var card = $("<div>").addClass("card").css("width", "18rem")
        var date = $("<h4>").text(moment().add(1,'days').format("[(]D[/]MM[/]YYYY[)]"))
        var iconUrl = "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png"
        //var img = $("<img>").attr("src", iconUrl)
        var img = $("<img>").attr({
            src: iconUrl,
            width: 70,
            height: 70
        })
        var temp = $("<h5>").text("Temp: " + data.list[i].main["temp"] + " F")
        var winds = $("<h5>").text("Wind: " + data.list[i].wind.speed + " MPH")
        var humid = $("<h5>").text("Humidity: " + data.list[i].main["temp"] + "%")
        card.append(date, img, temp, winds, humid)
        cardCont.append(card)
    }
    infoCont.append(cardCont)
    
}
//test url https://api.openweathermap.org/data/2.5/forecast?q=sunnyvale&appid=$db2c49bf1420cd2c3d40a1df5c2e744c

//test url https://api.openweathermap.org/data/2.5/forecast?q=sunnyvale&appid=3279c108edd62f03f66f2e92780c6761
