$(document).ready(() => {
     //making a POST AJAX request i.e send the data to the server without me having to reload the page.
    $.get("/Api/postsRoutesPath", {onlyFriends: true},feed => {//essentially what i have done here is keep a data log of all the post sents to an iMobMember's feed
       showcasePosts(feed, $(".postsContainer"));//once post is madde, everything resets back to base settings on frontend
    })
    
})

function showcasePosts(feed, container){
    container.html(""); //clears the contents of the this container passed in so that it repopulate with updated items
    feed.forEach(postItem => {//for loop goes through all items in the feed array and returns them in post form
        var html = formulatePostHtml(postItem)
        container.append(html);//as i said, this is how it will repopulate it
    });
    if(feed.length == 0){
        container.append("<span class='NoNewFeedItems'>Your feed is up to date</span>");//
    }
}