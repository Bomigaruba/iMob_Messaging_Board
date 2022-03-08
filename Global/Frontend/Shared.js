//Variables user by all events
var croppingAgent;
var search_Timer;
var availableUsers = [];

$(document).ready(()=> {
    refreshMessagesBadge();
    refreshNottiesBadge();
})
$("#postTextarea, #commentTextarea").keyup(event => {
    var textbox = $(event.target);
    //event.target was the element(#posttextarea) in whch the event(button press) was called on
    var field = textbox.val().trim();
    //stops a field with just spaces and no caharacters from being posted
    var modalOrNot = textbox.parents(".modal").length == 1;
 
    var postButton = modalOrNot ? $("#submitCommentButton") : $("#submitPostButton");// comments section or new main page post
    if(postButton.lenght == 0){ //To ensure that it's not just random spaces being sent
        return alert ("Internal Error with Submit Button");
    }
    if(field == "") { 
        postButton.prop("disabled", true); 
        return;
     }//If we get to this spot then the use hasnt started typing
     else{
        postButton.prop("disabled", false);//Now the post button can be shown
    }

})
//this tells the page when the keyboard keys have been released(i.e after something has been typed) has been written into a field and what to do with it
$("#submitPostButton, #submitCommentButton").click((event) => {
    var button = $(event.target);
    var modalOrNot = button.parents(".modal").length == 1;

    var textbox = modalOrNot ? $("#commentTextarea") : $("#postTextarea");
    

    var textBoxData = { //configuriing the data I want to send with this request
        content: textbox.val()//I.e the contents of the textbox field
    }
    if(modalOrNot){
        var buttonIdData = button.data().id;
        if(buttonIdData == null) return alert("Button data ain't here");
        textBoxData.commentOn = buttonIdData; //id of the post I am commenting on
    }

    //making a POST AJAX request i.e send the data to the server without me having to reload the page.
    $.post("/Api/postsRoutesPath", textBoxData, postedData => {//this ()=> is a callback fucntion that will be called when the textBoxData is sent to the /api/post URL
        if(postedData.commentOn){
            emitNottie(postedData.commentOn.authoredBy)
            location.reload();//helps to clear me out of the comment pop-up once the message is sent
        }
        else{
            var html = formulatePostHtml(postedData);
            $(".postsContainer").prepend(html);//add post to the top, append would have added post to the bottom of feed. This is a JQuery object btw.
            textbox.val("");
            button.prop("disabled",true);//once post is madde, everything resets back to base settings on frontend
        }

    })



})
//"show.bs.modal" == show.bootstrap.modal"
$("#commentModal").on("show.bs.modal", (event) => {
    var buttonAction = $(event.relatedTarget);// this is because when i pass in (event), the page might run into a "this event is related to 2 seperate actions"..
    //issue and not know how to handle it. so .relatedTarget  dictates the exact event it was fired from "i.e my clicking of the comments button on a post
    
    var commentId = grabIdInfoFromElement(buttonAction);
    $("#submitCommentButton").data("id", commentId);
    $.get("/Api/postsRoutesPath/" + commentId, feed => {//see iMobAppHome.js line 3 for details on this
        showcasePosts(feed.feedData, $("#originalPostContainer"));
     })

})

$("#commentModal").on("hidden.bs.modal", (event) => {//takes care of the latency issue when you switch to a different psot you want to comment on
    $("#originalPostContainer").html("");
})

$("#deletePostModal").on("show.bs.modal", (event) => {
    var buttonAction = $(event.relatedTarget);
    var commentId = grabIdInfoFromElement(buttonAction);
    $("#deleteButton").data("id", commentId);
})

$("#stopTheCapModal").on("show.bs.modal", (event) => {
    var buttonAction = $(event.relatedTarget);
    var commentId = grabIdInfoFromElement(buttonAction);
    $("#stopTheCapButton").data("id", commentId);
})

$("#retractCapClaimLabel").on("show.bs.modal", (event) => {
    var buttonAction = $(event.relatedTarget);
    var commentId = grabIdInfoFromElement(buttonAction);
    $("#retractCapClaimButton").data("id", commentId);
})

$("#deleteButton").click((event)=> {
    var itemToDelete = $(event.target).data("id");//event.target is a life saver
    $.ajax({// there are no "$.post" types for PUT and DELETE requests...what i had to learn is this format
        url:`/Api/postsRoutesPath/${itemToDelete}`, //specfies what i am trying to update
        type: "DELETE",
        success: () => {
            location.reload();
        }
    })
})

$("#stopTheCapButton").click((event)=> {
    var itemToCallCapOn = $(event.target).data("id");//event.target is a life saver
    $.ajax({
        url:`/Api/postsRoutesPath/${itemToCallCapOn}`,
        type: "PUT",
        data: {Capping: true},
        success: (data, status, xhr) => {
            if(xhr.status != 204){
                alert("BLOCKED BY BOMI!");
                return;
            }
            location.reload();
        }
   })
})

$("#retractCapClaimButton").click((event)=> {
    var itemToCallCapOn = $(event.target).data("id");//event.target is a life saver
    $.ajax({
        url:`/Api/postsRoutesPath/${itemToCallCapOn}`,
        type: "PUT",
        data: {Capping: true},
        success: (data, status, xhr) => {
            if(xhr.status != 204){
                alert("BLOCKED BY BOMI!");
                return;
            }
            location.reload();
        }
   })
})

$("#filePhoto").change(function(){// (event) => was giving me fits so I decided to use this
    // var input = $(event.target);
    // console.log(input);
    if(this.files && this.files[0]){
        var reader = new FileReader();// handles the image profile changing handshake
        reader.onload = (e) => {
            var image = document.getElementById("imagePreview");
            image.src = e.target.result;

            if(croppingAgent!== undefined){
               croppingAgent.destroy();   
            }
            croppingAgent = new Cropper(image, {
                    aspectRatio: 1 / 1,
                    background: false             
            });//background learning required for this
        }
        reader.readAsDataURL(this.files[0]);//read the info off the first item in the array which so happens to be my photo i am trying to upload...happy days
    }
    else{
        console.log('wait, thats illegal')
    }
})

$("#coverPhoto").change(function(){// (event) => was giving me fits so I decided to use this

    if(this.files && this.files[0]){
        var reader = new FileReader();// handles the image profile changing handshake
        reader.onload = (e) => {
            var image = document.getElementById("coverPreview");
            image.src = e.target.result;

            if(croppingAgent!== undefined){
               croppingAgent.destroy();   
            }
            croppingAgent = new Cropper(image, {
                    aspectRatio: 16 / 9,
                    background: false             
            });//background learning required for this
        }
        reader.readAsDataURL(this.files[0]);
    }
    else{
        console.log('wait, thats illegal')
    }
})

$("#imageUploadButton").click(() => {
    var Canvas = croppingAgent.getCroppedCanvas();

    if(Canvas == null){
        alert("That is an illegal image you got there, we dont do that over here")
        return;
    }
    Canvas.toBlob((blob) => {
            var formData  = new FormData();
            formData.append("croppedImage", blob);
            
            $.ajax({
                url:"/Api/usersRoutesPath/mugShotImage",
                type: "POST",
                data: formData,
                processData: false, //this forces jQuery not to convert form datat into a string...Jquery always does this unles specfied otherwise
                contentType: false, //this prevents jQuery from adding  it's own preset contentType label to this form and this prevents me from getting the boundary string
                success: () => { location.reload()}

            })
    })
})

$("#coverImageUploadButton").click(() => {
    var Canvas = croppingAgent.getCroppedCanvas();

    if(Canvas == null){
        alert("That is an illegal image you got there, we dont do that over here")
        return;
    }
    Canvas.toBlob((blob) => {
            var formData  = new FormData();
            formData.append("croppedImage", blob);
            
            $.ajax({
                url:"/Api/usersRoutesPath/backdropImage",
                type: "POST",
                data: formData,
                processData: false, //this forces jQuery not to convert form datat into a string...Jquery always does this unles specfied otherwise
                contentType: false, //this prevents jQuery from adding  it's own preset contentType label to this form and this prevents me from getting the boundary string
                success: () => { location.reload()}

            })
    })
})

$("#userSearchTextBox").keydown((event) => {
    clearTimeout(search_Timer);
    var textBox = $(event.target);
    var value = textBox.val();
    if(value == "" && (event.which == 8 || event.keyCode == 8)){
        availableUsers.pop();
        updatAvailableUsersHtml();
        $("#userSearchTextBox").val("").focus();
        if(availableUsers.length == 0){
            $("#slideIntoDMButton").prop("disabled", true);
        }
        
        //remove user
        return;
    }

    search_Timer = setTimeout( ()=> {
        value = textBox.val().trim();

        if(value == ""){
            $(".resultsContainer").html("");
        }
        else{
            searchUser(value);
        }
    }, 1000);

})

$("#slideIntoDMButton").click(() => {
    var data = JSON.stringify(availableUsers);
    $.post("/Api/DMs", {iMobMembers: data}, DM => {
        if(!DM || !DM._id){
            return alert("invalid credentials")
        }
        window.location.href = `/Messages/${DM._id}`;
    })
})

$(document).on("click", ".crownButton", (event) => {//This is dynamic content. meaning that is i had set..
    //..this action for the crown class to be a $(".cosignButton").click(event)..
    //then by the time the page loads the button arent on the page b/cause it is still making the call to go..
    //and grab them. the click handler needs to be attached to the document where the action it is waiting for..
    //is a click and the 2nd parameter is the element I want this to listen for
    var button = $(event.target);
    var postId = grabIdInfoFromElement(button);
    if(postId === undefined) return;

    $.ajax({// there are no "$.post" types for PUT and DELETE requests...what i had to learn is this format
        url:`/Api/postsRoutesPath/${postId}/crown`, //specfies what i am trying to update
        type: "PUT",
        success: (postData) => {
            button.find("span").text(postData.crowns.length || "");
            if(postData.crowns.includes(userLoggedIn._id)){ 
                  button.addClass("active"); 
                  emitNottie(postData.authoredBy)
                  location.reload();
            }
            else{ button.removeClass("active");}
        }
    })
})

$(document).on("click", ".cosignButton", (event) => {//This is faily similar to the cosign button arragnment
    var button = $(event.target);
    var postId = grabIdInfoFromElement(button);
    if(postId === undefined) return;

    $.ajax({
        url:`/Api/postsRoutesPath/${postId}/cosign`,
        type: "POST",
        success: (postData) => {
            button.find("span").text(postData.cosignFromMembers.length || "");
            if(postData.cosignFromMembers.includes(userLoggedIn._id)){  
                 button.addClass("active");
                 emitNottie(postData.authoredBy)
                 location.reload();
            }
            else{ button.removeClass("active");}
        }
    })
})

$(document).on("click", ".post", (event) => {
    var button = $(event.target);
    var postId = grabIdInfoFromElement(button);

    if(postId!= undefined && !button.is("button")){// If a user clicked on a post, i would want him/her/xer to be transported
        //to a new page where they can view just that post and it's corresponding comments if it had any.
        //the !button.is("button") condition catches the program fron allowing the buttons like the cosign or crown to
        //transport the user there. this action should strictly be left for clicking on the post directly 
        window.location.href = '/iMobPostPage/' + postId;
    }
})

$(document).on("click", ".followButton",(e) => {
    
        var button = $(e.target);
        var userAS = button.data().user;
        if(userAS === undefined) {
            return;
        }
        $.ajax({
                    url:`/Api/usersRoutesPath/${userAS}/follow`,
                    type: "PUT",
                    success: (data, status, xhr) => {
                        if(xhr.status == 404){
                            alert("user not found");
                            return;
                        }

                        var linkedCount = $('#linkedCommunityCount');
                        var Difference_counter = 1; 
                        if(data.linked && data.linked.includes(userAS)){
                            button.addClass("linked");
                            button.text("Linked");
                            emitNottie(userAS);
                        }
                        else{
                            Difference_counter = -1;                            
                            button.removeClass("linked");
                            button.text("Join");
                        }

                        if(linkedCount.length != 0){
                            var linkedCountText = linkedCount.text();
                            linkedCountText = parseInt(linkedCountText)
                            linkedCount.text(linkedCountText + Difference_counter);
                        }

                        // window.location.href = `/Api/usersRoutesPath/${userAS}/`;

                    }
        })
           
 })

 $(document).on("click", ".resultListItem.notification.active",(e) => {
            
            
            var container = $(e.target);
            var nottieId = container.data().id; 
            var href = container.attr("href");
            // e.preventDefault();
            var callback = () => window.location = href;
            markNottieAsOpen(nottieId, callback);
            location.reload();
})
    
    //         if(user === undefined) return "kross";

  

//     $.ajax({
//         url:`/Api/usersRoutesPath/${user}/follow`,
//         type: "PUT",
//         success: (data, status, xhr) => {
//             if(xhr.status == 404){
//                 alert("user not found");
//                 return;
//             }

//              var Difference_counter = -1;
//             if(!button.is('followButton linked')){  
//                 button.addClass("linked");
//                 button.text("Linked");
//            }
//            else{
//                button.removeClass("linked");
//                button.text("Join");
//                Difference_counter = -1;
//            }
//            var linkedCount = $('#CommunityCount');
//            if(linkedCount.length != 0) {
//                 var linkedCount = linkedCount.text();
//                 linkedCount = parseInt(linkedCount);
//                 linkedCount.text(linkedCount + Difference_counter)
//            }
//            window.location.href = `/Api/usersRoutesPath/${user}/`;
//         }
//     })


function grabIdInfoFromElement(element){
    var alreadyAtRoot = element.hasClass("post");
    var rootElement = alreadyAtRoot ? element : element.closest(".post");
    var postId = rootElement.data().id;
    //what's above is a terneray operator or a conditional operator...
    //uses if statment logic to make the output of what is being assigned to the " item1 ? item2"
    //normally assocated with a boolean so 

    if(postId === undefined) return alert("major issues with the postID scan");
    
    return postId;
}
//info for this found in postRoutesPath.js
function showcasePosts(feed, container){
    container.html(""); //clears the contents of the this container passed in so that it repopulate with updated items

    //KEY POINT HERE
    if(!Array.isArray(feed)){
        feed = [feed];
    }
    //
    feed.forEach(postItem => {//for loop goes through all items in the feed array and returns them in post form
        var html = formulatePostHtml(postItem)
        container.append(html);//as i said, this is how it will repopulate it
    });
    if(feed.length == 0){
        container.append("<span class='NoNewFeedItems'>Your feed is up to date</span>");//
    }
}

function formulatePostHtml(postedData, identifyingFont = false){//enables the user easily identify which one they clicked on
    //the 'identifyingFont" parameter will be used in the showcasePostsInCommentThread function to implemenet this in a
    //thread scenario
        

        var isCosign = postedData.cosignData !== undefined;
        var cosignedBy = isCosign ? postedData.authoredBy.UserName : null;
        postedData = isCosign ? postedData.cosignData : postedData;

        
        var madeBy = postedData.authoredBy;
        //MongoDb will see posts database items as an ObjectID,  not a the same as user ID.. 
        //..which will give an idea of who made a certain post
        if(madeBy == null){
           
            console.log("User not found or field is undefined. refactoring needed")
            
        }

        var message = postedData.content
        var iMobCredentials = madeBy.FirstName + " " + madeBy.LastName;
        var timelog = timeComputation(new Date(), new Date(postedData.createdAt) );//This takes care of the presentation of time from when the post was made
    //I can inject variables with the help of "backticks"....these(``). this is specific to javascript and has a special way of handling
    // double quotes. you will see me use a lot of single quotes(' ') while in the  backticks operation mode.

        var cosignButtonActive = postedData.cosignFromMembers.includes(userLoggedIn._id) ? "active": "";
        var crownButtonActive = postedData.crowns.includes(userLoggedIn._id) ? "active": "";
        var identifyingFontSection = identifyingFont ? "bigText" : "";

        var cosignText = '';
        if(isCosign){
            cosignText = `<span>
                            <i class='fa fa-hand-spock-o'></i>
                            cosigned by <a href='/iMobProfilePage/${cosignedBy}'>@${cosignedBy}</a>
                        </span>`
        }
        var commentFlag = "";
        if(postedData.commentOn && postedData.commentOn._id){
            if(!postedData.commentOn._id){
                return alert ("no field for commentOn")
            }
            else if(!postedData.commentOn.authoredBy._id){
                return alert ("no field for commentOn")
            }    
            var commentOnUserName = postedData.commentOn.authoredBy.UserName;
            commentFlag = `<div class='commentFlag'>
                              Responding to <a href='/iMobProfilePage/${commentOnUserName}'>@${commentOnUserName}</a>
                           </div>`;   
        }
        var toolButton = "";
        var capClaim = "";
        if(postedData.authoredBy._id == userLoggedIn._id){

            var wasCalledCap = "";
            var retractCapClaim = "#stopTheCapModal";
            if(postedData.Capping === true){
                wasCalledCap = "active";
                retractCapClaim = "#retractCapClaim";
                capClaim = `<span><a href='/iMobProfilePage/${userLoggedIn.UserName}'>@${userLoggedIn.UserName}</a> calls<i class='fa-brands fa-pied-piper-hat'></i>on this post</span>`;
            }


           toolButton =  `<button class='stopTheCapButton ${wasCalledCap}' data-id="${postedData._id}" data-toggle="modal" data-target="${retractCapClaim}"><i class='fa-brands fa-pied-piper-hat'></i></button>
                              <button data-id="${postedData._id}" data-toggle="modal" data-target="#deletePostModal"><i class='fa-solid fa-thumbs-down'></i></button>`;
        }
        
        return `<div class='post ${identifyingFontSection}' data-id='${postedData._id}'>
                <div class='postCosignContainer'>
                    ${cosignText}
                </div>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${madeBy.MugShotPic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='capClaim'>${capClaim}</div>
                        <div class='header'>
                            <a href='/iMobProfilePage/${madeBy.UserName}' class='displayName'>${iMobCredentials}</a>
                            <span class='username'>@${madeBy.UserName}</span>
                            <span class='date'>${timelog}</span>
                            ${toolButton}
                        </div>
                        ${commentFlag}
                        <div class='postBody'>
                            <span>${message}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='postButtonContainer green'>
                                <button class='cosignButton ${cosignButtonActive}'>
                                     <i class='fa fa-hand-spock-o'></i>
                                     <span>${postedData.cosignFromMembers.length || ""}</span>
                                </button>
                            </div>
                            <div class='postButtonContainer blue'>
                                <button data-toggle='modal' data-target='#commentModal'>
                                    <i class='fa fa-comments-o' aria-hidden='true'></i>
                                </button>   
                            </div>
                            <div class='postButtonContainer purple'>
                                <button class='crownButton ${crownButtonActive}'>
                                     <i class="fa-solid fa-chess-king"></i>
                                     <span>${postedData.crowns.length || ""}</span>
                                </button>   
                            </div>
                        </div>                                              
                    </div>
                </div>
            </div>`
          ;
            //what gets outputed to the client side frontend is the feed of the author(iMobMember) who made the post.
}

function timeComputation(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed / 1000 < 30) return "Commited now";
         return '  '+Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return '  '+Math.round(elapsed/msPerMinute) + ' Mins ago' + ',  I think :)';   
    }

    else if (elapsed < msPerDay ) {
         return '  '+Math.round(elapsed/msPerHour ) + ' Hours ago' + '. No 🧢';   
    }

    else if (elapsed < msPerMonth) {
        return '  '+Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return  '  '+Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return  '  '+Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

function showcasePostsInCommentThread(feed, container){
    container.html(""); //clears the contents of the this container passed in so that it repopulate with updated items

    if(feed.commentOn !== undefined && feed.commentOn._id !== undefined){// if there is already a pre existing message thread
        var html = formulatePostHtml(feed.commentOn)
        container.append(html);
    }
    var clickedOnPosthtml = formulatePostHtml(feed.feedData, true)
    container.append(clickedOnPosthtml);//suppose there is a specific comment the user clicked on within the thread, this handles that

    feed.messageThread.forEach(feedData => {
        var html = formulatePostHtml(feedData)
        container.append(html);
    });
}

function outputUserTags(data, container){
    container.html("") //done so that i can empty out the container for the feed slots
    
    data.forEach(result => {
        var html = formulateFeedHtml(result, true);
        container.append(html);
    })

    if(data.length == 0){
    container.append("<span class='NullResults'>No data found</span>")
    }
}

function formulateFeedHtml(userData, showJoinButton){

    var alreadyLinked = userLoggedIn.linked && userLoggedIn.linked.includes(userData._id);
    //var alreadyInCommunity = userLoggedIn.confirmedLinked && userLoggedIn.confirmedLinked.includes(userData._id);
    var text = alreadyLinked ? "Linked" : "Join"
    var buttonClass = alreadyLinked ? "followButton linked" : "followButton"
    
    var joinButton = "";
    if(showJoinButton && userLoggedIn._id != userData._id){
        joinButton = `<div class='followButtonContainer'>
                         <button class='${buttonClass}' data-user='${userData._id}'>${text}</button>
                     </div>`;
    }
    // if(){}
    return `<div class='user'>
                <div class='userImageContainer'>
                    <img src='${userData.MugShotPic}'>
                </div>
                <div class='userDetailsContainer'>
                    <div class='header'>
                        <a href='/iMobProfile/${userData.UserName}'>${userData.FirstName} ${userData.LastName}</a>
                        <span class='username'>@${userData.UserName}</span>
                    </div>
                </div>
                ${joinButton}
            </div>`
}

function searchUser(itemInQueston){
    // console.log("hi");
    $.get("/Api/usersRoutesPath", {search: itemInQueston}, (results) => {
        outputAvailableUserTags(results, $(".resultsContainer"));
    })
}

function outputAvailableUserTags(data, container){
    container.html("") //done so that i can empty out the container for the feed slots
    data.forEach(result => {
        if(result._id == userLoggedIn._id || availableUsers.some((user )=> user._id == result._id) ){
            return;
        }
        var html = formulateFeedHtml(result, false);
        var element = $(html);
        element.click(() => targetAudience(result))

        container.append(element);
    })

    if(data.length == 0){
    container.append("<span class='NullResults'>No data found</span>")
    }
}

function targetAudience(user){
    availableUsers.push(user);
    updatAvailableUsersHtml(user);
    $("#userSearchTextBox").val("").focus();
    $(".resultsContainer").html("");
    $("#slideIntoDMButton").prop("disabled", false);

}

function updatAvailableUsersHtml(){
    var elements = [];

    availableUsers.forEach( (user) =>{
        var userElement = $(`<span class='availableUser'>${user.UserName}</span>`);
        elements.push(userElement);
   })
    $(".availableUser").remove();
    $("#availableUsers").prepend(elements);
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

function markNottieAsOpen(nottieid = null, callback = null){
    location.reload();
    if(callback == null) callback = () => location.reload();
    var url = nottieid != null ? `/Api/Notifications/${nottieid}/markedAsOpened`: `/Api/Notifications/markedAsOpened`;
    $.ajax ({
        url: url,
        type: "PUT",
        success: () => callback()
    })
}
function messageReceived(newMessage){
    if($(`[data-room="${newMessage.DM._id}"]`).length == 0){
        pushMessageIconDisplay(newMessage)
    }
    else{
        addChatMessagesHtml(newMessage);
    }
    refreshMessagesBadge();
}
function refreshMessagesBadge(){
    $.get("/Api/DMs", {unreadOnly: true}, (data) => {
        var unreadBlocks = data.length;
        if(unreadBlocks > 0){
            $("#DMsBadge").text(unreadBlocks).addClass("active");
        }
        else{
            $("#DMsBadge").text(unreadBlocks).removeClass("actsive");
        }
    })
}
function refreshNottiesBadge(){
    $.get("/Api/Notifications", {unreadOnly: true}, (data) => {
    
        var unreadBlocks = data.length;
        if(unreadBlocks > 0){
            $("#notificationBadge").text(unreadBlocks).addClass("active");
        }
        else{
            $("#notificationBadge").text(unreadBlocks).removeClass("actsive");
        }
    })
}
//Stuff dedidcated to message popups
function pushMessageIconDisplay(data){
    if(!data.chat.latestMessage._id){
        data.chat.latestMessage = data;
    }

    var html = formulateChatHtml(data.chat);
    var jQueryEquivalent = $(html);
    jQueryEquivalent.hide().prependTo("#nottieList").slideDown("fast");
    setTimeout(() => {
        jQueryEquivalent.fadeOut(420); //;)
    }, 5000);
}
function formulateChatHtml(ChatLog){
    //  var DMName = "getDMName";
    var DMName = getDMName(ChatLog);
    var images = getImageOfUsers(ChatLog);
    var latestMessage = getLatestMessage(ChatLog.latestMessage);

    var activeState = !ChatLog.latestMessage || ChatLog.latestMessage.readBy.includes(userLoggedIn._id) ? "" : "active";
    return `<a href='/Messages/${ChatLog._id}' class ='resultListItem ${activeState}'>
                ${images}
                <div class='resultsDetailsContainer ellipsis'>
                    <span class='heading ellipsis'>${DMName}</span>
                    <span class='subText ellipsis'>${latestMessage}</span>
                </div>
            </a>`;
}

function getLatestMessage(latestMessage){
    if(latestMessage != null){
        var sender = latestMessage.sender;
       return `${sender.FirstName}${sender.LastName}: ${latestMessage.content}`;
    }

    return `New Chat`;

}


function getImageOfUsers(ChatLog){
    var othersInChat = grabAllOtherChatUsers(ChatLog.iMobMembers);
    var groupClass = "";
    var chatImage =  getImageOfUser(othersInChat[0]);
    if(othersInChat.length > 1){
        groupClass = "squadImage";
        chatImage += getImageOfUser(othersInChat[1]);
    }

    return `<div class='resultsImageContainer ${groupClass}'>${chatImage}</div>`; 
}

function getImageOfUser(iMobMember){
    if(!iMobMember || !iMobMember.MugShotPic ){
        return alert (" No one showing their face huh")
    }
    return `<img src='${iMobMember.MugShotPic}' alt ='mugShot'>`;
}

//Stuff dedidcated to cosigns, crowns, links, and comments popups
function pushNottieIconDisplay(data){
    var html = createNottieHtml(data);
    var jQueryEquivalent = $(html);
    jQueryEquivalent.hide().prependTo("#nottieList").slideDown("fast");
    setTimeout(() => {
        jQueryEquivalent.fadeOut(420); //;)
    }, 5000);
}

function outputNottiesList(Notifications, container){
    Notifications.forEach(nottie =>{
        var html = createNottieHtml(nottie);
        container.append(html);
    })
    if(Notifications.length == 0){
        container.append("<span>Nothing Popping for Ya?</span>");
    }
}

function createNottieHtml(nottie){
    var Userfrom = nottie.UserFrom;
    var href = createNottieURL(nottie);
    var text = createNottieMessage(nottie);
    var className = nottie.readBy ? "": "active";
    

    return `<a href='${href}' class='resultListItem notification ${className}' data-id='${nottie._id}'>
                <div class='resultsImageContainer'>
                    <img src='${Userfrom.MugShotPic}'>
                </div>
                <div class='resultsDetailsContainer ellipsis'>
                    <span class='heading ellipsis'>${text}</span>
                </div>

            </a>`;
}

function createNottieMessage(nottie){
    var Userfrom = nottie.UserFrom;
    if(!Userfrom.FirstName || !Userfrom.LastName){
        return alert("Corrupted data")
    }

    var UserfromName = `${Userfrom.FirstName} ${Userfrom.LastName}`;

    var text = "";

    if(nottie.NotiType == "Cosigned"){
        text = `${UserfromName} Cosigned what you were saying in this post`;
    }
    else if(nottie.NotiType == "iMobPost Crowned"){
        text = `${UserfromName} put a crown on this post`;
    }
    else if(nottie.NotiType == "Replied to"){
        text = `${UserfromName} shared an opinion on this post`;
    }
    else if(nottie.NotiType == "Joined"){
        text = `${UserfromName} joined your Mob community`;
    }    


    return `<span class='ellipsis'>${text}</span>`;
}

function createNottieURL(nottie){
    var url = "#";

    if(nottie.NotiType == "Cosigned" || 
        nottie.NotiType == "iMobPost Crowned" ||
             nottie.NotiType == "Replied to"){
                url = `/iMobPostPage/${nottie.entityId}`;
    }
    if(nottie.NotiType == "Joined"){
        url = `/iMobProfilePage/${nottie.entityId}`;
    }    


    return url;
}
/*
    //making a POST AJAX request i.e send the data to the server without me having to reload the page.
    $.post("/Api/postsRoutesPath", textBoxData, (postedData, status, xhr) => {//this ()=> is a callback fucntion that will be called when the textBoxData is sent to the /api/post URL
        console.log(postedData);
        //once it the /api/post is completed then it will move on to this ()=> function.
        //xhr stands for XML http request which is essentially the status of the request.
        // succeeds and it wiil gove 200, fail and I will get 404. Rememeber clients(laptops, phones, smartwatches) are the frontend viewers
        //of my app. $.get() -> /api/posts
    })
*/