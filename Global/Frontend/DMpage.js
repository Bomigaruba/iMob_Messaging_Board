//This is the equvalent of chatspage.
var typing= false;
var lastTypingTime;
$(document).ready(() => {
    socket.emit("join room", DMid);
    socket.on("typing", () => $(".typingDots").show());
    socket.on("stop typing", () => $(".typingDots").hide());

    $.get(`/Api/DMs/${DMid}`, (data) => {
        $("#DMName").text(getDMName(data));
    })

    $.get(`/Api/DMs/Messages/${DMid}`, (data) => {

        $(document).ready(() => {
            $(".loadingCarltonContainer").remove();
            $(".chatContainer").css("visibility", "visible");
            var messages = [];
            var lastSenderId = "";
          
            data.forEach((message, index) => {
                var html = createMessageHtml(message, data[index + 1], lastSenderId);
                messages.push(html);
                lastSenderId = message.sender._id;
            });
            var messageshtml = messages.join("");
            addMessagesHtmlToPage(messageshtml);
            scrollToBottom(false);
            markAllMessagesAsRead();
        });

    })  
})

$("#changeChatNameButton").click(() => {
    var name = $("#chatNameTextbox").val().trim();

    // console.log(name);
    $.ajax({
       url: "/Api/DMs/" + DMid,
       type: "PUT",
       data: {DMName: name},
       success: (data, status, xhr) => {
            if(xhr.status != 204){
                alert ("could not be opened");

            }
            else {location.reload();}
        } 
        
    })
})

$(".sendMessageButton").click(() => {
    messageSubmitted();
})

$(".inputTextBox").keydown((event) => {
    updateTyping();

    if(event.which === 13){
        messageSubmitted();
        return false;
    }
})
function updateTyping(){
        if(!connected){return;}
        if(!typing){
            typing = true;
            socket.emit("typing", DMid);
        }

        lastTypingTime  = new Date().getTime();
        var timerLength = 3000;
        
        setTimeout(() =>{
            var timeNow = new Date().getTime();
            var timeDifference = timeNow = lastTypingTime;
            if(timeDifference>= timerLength && typing){
                socket.emit("stop typing", DMid);  
                typing = false;
            }
        }, timerLength);

    socket.emit("typing", DMid);
}

function addMessagesHtmlToPage(html){
    $(".directMessages").append(html);
}


function messageSubmitted(){
    var content = $(".inputTextBox").val().trim()

    if(content != ""){
        sendMessage(content);
        $(".inputTextBox").val("");
        socket.emit("stop typing", DMid);  
        typing = false;        
    }
}

function sendMessage(content){
    $.post("/Api/Messages/", {content: content, DMid: DMid}, (data, status, xhr) => {

        if(xhr.status != 201){
            alert("message failed to send");
            $(".inputTextBox").val(content);
            return;
        }     
        addChatMessagesHtml(data);

        if(connected){
            socket.emit("new message", data);
        }
    })
}

function addChatMessagesHtml(message){
    if(!message || !message._id){
        alert("not the best output :)")
        return;
    }
    var messageDiv = createMessageHtml(message, null, "");

   addMessagesHtmlToPage(messageDiv);
}

function createMessageHtml(message, newMessage, lastSenderId){

    var sender = message.sender;
    var senderName = sender.FirstName +" "+sender.LastName;

    var currentSenderId = sender._id;
    var nextSenderId = newMessage != null ? newMessage.sender._id : "";

    var isFirst = lastSenderId != currentSenderId;
    var isLast = nextSenderId != currentSenderId;

    var isMine = message.sender._id == userLoggedIn._id;
    var liClassName = isMine ? "mine" : "theirs";

    var nameElement = "";
    if(isFirst){
        liClassName += " first";
        if(!isMine){
            nameElement = `<span class='senderName'>${senderName}</span>`;
        }
    }
    var profilePic = "";

    if(isLast){
        liClassName += " last";
        profilePic = `<img src='${sender.MugShotPic}'>`;
    }
    var imageContainer ="";
    if(!isMine) {
        imageContainer = `<span class='imageContainer'>
                            ${profilePic}
                         </span>`;
    }
   

    return `<li class ='message ${liClassName}'>
                <div class='messageContainer'>
                    ${nameElement}
                    <span class='messageBody'>
                        ${message.content}
                    </span>
                    ${imageContainer}
                </div>
            </li>`;
}

function getDMName(ChatLog){
    var chatName = ChatLog.DMName;
    if(!chatName){
        var othersInChat = grabAllOtherChatUsers(ChatLog.iMobMembers);
        var ListofNames =  othersInChat.map(user => user.FirstName);
        chatName = ListofNames.join(", ");
    }
    return chatName;

}

function grabAllOtherChatUsers(iMobMembers){
    if(iMobMembers.length == 1){
        return iMobMembers;
    }
    return iMobMembers.filter( user => user._id != userLoggedIn._id)
}

function scrollToBottom(animated){
    var container = $(".directMessages");
    var  scrollHeight = container[0].scrollHeight;
    if(animated){
        container.animate({scrollTop: scrollHeight}, "slow");
    }
    else{
        container.scrollTop(scrollHeight);
    }
}

function markAllMessagesAsRead(){
    $.ajax({
        url: `/Api/DMs/${DMid}/Messages/markedAsRead`,
        type: "PUT",
        success: () => refreshMessagesBadge()
    })
}
