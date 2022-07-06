var searchHistory = []
var infoCont = $(".info-container")
var lon
var lat
var uv
var colorCode

//console.log(moment().format("ddd, hA"))
//console.log(moment().unix())

$(document).on("click", "#search-btn", function(event){
    var cityName = $(this).siblings("#city-search-val").val()
    //getWeatherData(cityName)
    getGeoLocation(cityName)
    addToHistory(cityName)

})

function addToHistory(name){
    if(searchHistory.includes(name)){
        return
    }
    searchHistory.unshift(name)
    var histCont = $("#history-cont")
    var cityBtn = $("<button>").addClass("btn btn-secondary text-light my-2").text(name)
    histCont.append(cityBtn)
}

function getWeatherData(name){
    //var getUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + name + "&units=imperial&appid=410463b3935acea56c8171825dbb4440"
    //var getUrl = "https://api.openweathermap.org/data/2.5/onecall?q="+name+"&exclude=hourly&units=imperial&appid=410463b3935acea56c8171825dbb4440"
    //var getUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=410463b3935acea56c8171825dbb4440"
    var getUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=3279c108edd62f03f66f2e92780c6761"
    
    $.ajax({
        url: getUrl,
        method: "GET"
    })
        .then(function(response){
            //console.log(lon,lat)
            console.log(response)
            //getUV(name)
            //addToHistory(name)
            //console.log(response.list[0].main["temp"])
            //console.log(response.list[0].dt_txt)

            displayCurrentTemp(response, name)
            displayForecastCards(response)
        })
}

function getGeoLocation(name){
    $.ajax({
        url: "https://api.openweathermap.org/geo/1.0/direct?q=" + name + "&limit=1&appid=410463b3935acea56c8171825dbb4440",
        method: "GET"
    })
        .then(function(response){
            //console.log("geo loc", response)
            lon = response[0].lon
            lat = response[0].lat
            //getUV()
            //displayCurrentTemp(response)
            getWeatherData(name)
        })
}

function colorCodeUV(index){
    if(index >= 8){
        colorCode = "bg-danger"
    } else if(index >= 3){
        colorCode = "bg-warning"
    } else {
        colorCode = "bg-success"
    }
}

function getUV(){
    var getUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=3279c108edd62f03f66f2e92780c6761"
    $.ajax({
        url: getUrl,
        method: "GET"
    })
        .then(function(response){
            console.log("UV data", response)
            uv = response.current.uvi
            if(uv >= 8){
                colorCode = "bg-danger"
            } else if(uv >= 3){
                colorCode = "bg-warning"
            } else {
                colorCode = "bg-success"
            }
            var uvTitle = $("<h5>").text("UV Index: ").addClass("d-flex flex-row")
            uvTitle.append($("<h5>").text(" "+uv).addClass(colorCode))
            $(".curr-temp-cont").append(uvTitle)
             
        })
}

function displayCurrentTemp(data,name){
    var currTempCont = $("<div>").addClass("container d-flex flex-column curr-temp-cont")
    var iconUrl = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png"
    var img = $("<img>").attr("src", iconUrl)
    img.attr("alt", "Weather Icon")
    //console.log(data.current.dt, typeof(data.current.dt, String(data.current.dt), typeof(String(data.current.dt))))
    var title = $("<h2>").text(name +" "+ moment().format("[(]M[/]DD[/]YYYY[)]"))
    title.append(img)
    var temp = $("<h5>").text("Temp: " + data.current.temp + " F")
    var winds = $("<h5>").text("Wind: " + data.current.wind_speed + " MPH")
    var humid = $("<h5>").text("Humidity: " + data.current.humidity + "%")
    var uvTitle = $("<h5>").text("UV Index: ").addClass("d-flex flex-row")
    colorCodeUV(data.current.uvi)
    uvTitle.append($("<h5>").text(" "+ data.current.uvi).addClass(colorCode))
    currTempCont.append(title, temp, winds, humid, uvTitle)
    infoCont.append(currTempCont)
    //console.log(data.city["name"] + moment(data.list[0].dt_txt).format("[(]D[/]MM[/]YYYY[)]"))
}

function displayForecastCards(data){
    var title = $("<h3>").text("5-Day Forecast:").addClass("container")
    var cardCont = $("<div>").addClass("container d-flex flex-row")
    infoCont.append(title)
    
    for(var i = 0; i < 5; i++){
        var card = $("<div>").addClass("card").css("width", "18rem")
        var date = $("<h4>").text(moment().add(i+1,'days').format("[(]M[/]DD[/]YYYY[)]"))
        var iconUrl = "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png"
        //var img = $("<img>").attr("src", iconUrl)
        var img = $("<img>").attr({
            src: iconUrl,
            width: 70,
            height: 70
        })
        var temp = $("<h5>").text("Temp: " + data.daily[i].temp["day"] + " F")
        var winds = $("<h5>").text("Wind: " + data.daily[i].wind_speed + " MPH")
        var humid = $("<h5>").text("Humidity: " + data.daily[i].humidity + "%")
        card.append(date, img, temp, winds, humid)
        cardCont.append(card)
    }
    infoCont.append(cardCont)
    
}
//test url https://api.openweathermap.org/data/2.5/forecast?q=sunnyvale&appid=$db2c49bf1420cd2c3d40a1df5c2e744c

//test url https://api.openweathermap.org/data/2.5/forecast?q=sunnyvale&appid=3279c108edd62f03f66f2e92780c6761
