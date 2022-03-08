var connected = false;
var socket = io("http://localhost:3005");
socket.emit("setup", userLoggedIn);

socket.on ("connected", () => connected = true);
socket.on ("message received", (newMessage) => messageReceived(newMessage));

socket.on("Notification received", () => {
    $.get("/Api/Notifications/brandNew", (nottieData) => {
        pushNottieIconDisplay(nottieData);
        refreshNottiesBadge();
    })
})
function emitNottie(id){
    if(id == userLoggedIn._id) return;
    socket.emit("Notification received", id);
}