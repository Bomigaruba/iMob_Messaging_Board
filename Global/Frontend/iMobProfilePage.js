$(document).ready(()=> {
   if(selectedTab === "Comments"){
      triageComments()
   }
   else {
       triagePosts();
   }
});
function triagePosts(){
    $.get("/Api/postsRoutesPath", { authoredBy: iMobMemberProfileId , Capping: true }, feed => {
            showcaseCapClaim(feed, $(".capClaimContainer"));
    })
}
function triagePosts(){
    $.get("/Api/postsRoutesPath", { authoredBy: iMobMemberProfileId , isComment: false }, feed => {
            showcasePosts(feed, $(".postsContainer"));
    })
}
function triageComments(){
    $.get("/Api/postsRoutesPath", { authoredBy: iMobMemberProfileId , isComment: true }, feed => {
            showcasePosts(feed, $(".postsContainer"));
    })
}

function showcaseCapClaim(feed, container){
    if(feed.length == 0){
        container.hide();
        return;
    }
    container.html(""); //clears the contents of the this container passed in so that it repopulate with updated items

    feed.forEach(postItem => {//for loop goes through all items in the feed array and returns them in post form
        var html = formulatePostHtml(postItem)
        container.append(html);//as i said, this is how it will repopulate it
    });
}