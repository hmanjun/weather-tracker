var searchHistory = []

$(document).on("click", "#search-btn", function(event){
    var cityName = $(this).siblings("#city-search-val").val()
    addToHistory(cityName)
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
    var getUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + name + "&appid=db2c49bf1420cd2c3d40a1df5c2e744c"
    $.ajax({
        url: getUrl,
        method: "GET"
    })
        .then(function(response){
            console.log(response)
        })
}

//test url https://api.openweathermap.org/data/2.5/forecast?q=sunnyvale&appid=$db2c49bf1420cd2c3d40a1df5c2e744c