//this is the equivalent of inbox page

$(document).ready(  () => {
    $.get("/Api/DMs" , (ChatLog, status, xhr) => {
        if(xhr.status == 400){
            alert("could not find");
        }
        else{
            outputChatList(ChatLog, $(".resultsContainer"));
        }

    })
})
function outputChatList(ChatLog, container){
    ChatLog.forEach(DM => {
        var html = formulateChatHtml(DM);
        container.append(html);
    })

    if(ChatLog.length == 0){
        container.append("<span>Nothing Popping for Ya?</span>");
    }
    // console.log(ChatLog);
}