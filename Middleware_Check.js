exports.requireLogin = (req, res, next) => {
//what this "next" is there for is to tell the program to move on to the next
//step in the cycle.
    if(req.session && req.session.user){
        // checking is the user property and the session property is set
        //if they aren then we know the user is not around
        return next();//passes on to the next step in the check cycle
    }
    else{
        return res.redirect("/login");
    }
}