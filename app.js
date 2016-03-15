var myUserId = "@pawan:127.0.0.1";
var myAccessToken = "MDAxN2xvY2F0aW9uIDEyNy4wLjAuMQowMDEzaWRlbnRpZmllciBrZXkKMDAxMGNpZCBnZW4gPSAxCjAwMjNjaWQgdXNlcl9pZCA9IEBwYXdhbjoxMjcuMC4wLjEKMDAxNmNpZCB0eXBlID0gYWNjZXNzCjAwMWRjaWQgdGltZSA8IDE0NTc5NjIyNjU2OTcKMDAyZnNpZ25hdHVyZSB0uTdWzsG_WSR4m6i05wqaFJhic3ytT0T07yHcvR_Dvgo";

var sdk = require("matrix-js-sdk");
// var clc = require("cli-color");
var matrixClient = sdk.createClient({
    baseUrl: "http://localhost:8008",
    accessToken: myAccessToken,
    userId: myUserId
});

console.log(matrixClient.getAccessToken());

matrixClient.on("Room.timeline", function(event, room, toStartOfTimeline) {
       if (toStartOfTimeline) {
           return; // don't print paginated results
       }
       if (event.getType() !== "m.room.message") {
           return; // only print messages
       }
       console.log(
           // the room name will update with m.room.name events automatically
           "(%s) %s :: %s", room.name, event.getSender(), event.getContent().body
       );
   });
console.log("starting");
   matrixClient.startClient();
