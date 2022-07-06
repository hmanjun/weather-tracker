var searchHistory = []
var infoCont = $(".info-container")

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
    $.ajax({
        url: getUrl,
        method: "GET"
    })
        .then(function(response){
            console.log(response)
            addToHistory(name)
            //console.log(response.list[0].main["temp"])
            //console.log(response.list[0].dt_txt)
            displayCurrentTemp(response)
        })
}

function displayCurrentTemp(data){
    var currTempCont = $("<div>").addClass("container d-flex flex-column")
    var title = $("<h2>").text(data.city["name"] +" "+ moment(data.list[0].dt_txt).format("[(]D[/]MM[/]YYYY[)]"))
    var temp = $("<h5>").text("Temp: " + data.list[0].main["temp"] + " F")
    var winds = $("<h5>").text("Wind: " + data.list[0].wind.speed + " MPH")
    var humid = $("<h5>").text("Humidity: " + data.list[0].main["temp"] + "%")
    currTempCont.append(title, temp, winds, humid)
    infoCont.append(currTempCont)
    console.log(data.city["name"] + moment(data.list[0].dt_txt).format("[(]D[/]MM[/]YYYY[)]"))
    //data.list[0].weather[0].icon
}
//test url https://api.openweathermap.org/data/2.5/forecast?q=sunnyvale&appid=$db2c49bf1420cd2c3d40a1df5c2e744c

//test url https://api.openweathermap.org/data/2.5/forecast?q=sunnyvale&appid=3279c108edd62f03f66f2e92780c6761
