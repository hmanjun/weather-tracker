var searchHistory = []

$(document).on("click", "#search-btn", function(event){
    var cityName = $(this).siblings("#city-search-val").val()
    addToHistory(cityName)

})

function addToHistory(cityName){
    if(searchHistory.includes(cityName)){
        return
    }
    console.log("reached funct")
    searchHistory.unshift(cityName)
    var histCont = $("#history-cont")
    var cityBtn = $("<button>").addClass("btn btn-secondary text-light my-2").text(cityName)
    histCont.append(cityBtn)
}
