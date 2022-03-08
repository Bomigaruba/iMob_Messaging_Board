$(document).ready(()=> {
    if(selectedTab === "confirmedLinked"){
        triageCommunity();
    }
    else {
        triageCloseFriends();
    }
 });


    function triageCommunity(){
        $.get(`/Api/usersRoutesPath/${iMobMemberProfileId}/confirmedLinked`, feed => {
                outputUserTags(feed.confirmedLinked, $(".resultsContainer"));
        })
    }


    function triageCloseFriends(){ 
        $.get(`/Api/usersRoutesPath/${iMobMemberProfileId}/linked`, feed => {
                outputUserTags(feed.linked, $(".resultsContainer"));
        })
    }
