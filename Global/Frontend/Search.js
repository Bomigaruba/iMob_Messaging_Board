
$("#searchBox").keydown((event) => {
    clearTimeout(search_Timer);
    var textBox = $(event.target);
    var value = textBox.val();
    var itemType = textBox.data().search;

    search_Timer = setTimeout( ()=> {
        value = textBox.val().trim();
        if(value == ""){
            $(".resultsContainer").html("");
        }
        else{
            search(value, itemType);
        }
    }, 1000);

})

function search(itemInQueston, itemType){
    var url  = itemType == "usersRoutesPath" ? "/Api/usersRoutesPath" : "/Api/postsRoutesPath"
    $.get(url, {search: itemInQueston}, (results) => {
        //console.log(results);

        if(itemType == "usersRoutesPath"){
            outputUserTags(results, $(".resultsContainer"));
        }
        else{
            showcasePosts(results, $(".resultsContainer"));
        }
    })
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