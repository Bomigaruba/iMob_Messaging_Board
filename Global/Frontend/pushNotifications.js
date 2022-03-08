$(document).ready(() => {
    $.get("/Api/Notifications", (data) => {
        outputNottiesList(data, $(".resultsContainer"));
    })
});
$("#markNottiesAsRead").click(()=> markNottieAsOpen())
