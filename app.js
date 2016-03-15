var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('contactlist', ['contactlist']);
var bodyParser = require('body-parser');
var sdk = require("matrix-js-sdk");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var matrixClient;
app.post('/login',function(req, res) {
  var body = req.body;
  var myUserId = body.user_id;
  var myAccessToken = body.access_token;
  matrixClient = sdk.createClient({
    baseUrl: "http://localhost:8008",
    accessToken: myAccessToken,
    userId: myUserId
  });
  console.log("starting");
  matrixClient.startClient();
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
});

app.listen(3000);
console.log("server on port 3000");

// var myUserId = "@pawan:127.0.0.1";
// var myAccessToken = "MDAxN2xvY2F0aW9uIDEyNy4wLjAuMQowMDEzaWRlbnRpZmllciBrZXkKMDAxMGNpZCBnZW4gPSAxCjAwMjNjaWQgdXNlcl9pZCA9IEBwYXdhbjoxMjcuMC4wLjEKMDAxNmNpZCB0eXBlID0gYWNjZXNzCjAwMWRjaWQgdGltZSA8IDE0NTc5NjIyNjU2OTcKMDAyZnNpZ25hdHVyZSB0uTdWzsG_WSR4m6i05wqaFJhic3ytT0T07yHcvR_Dvgo";

// 
// // var clc = require("cli-color");
// var matrixClient = sdk.createClient({
//     baseUrl: "http://localhost:8008",
//     accessToken: myAccessToken,
//     userId: myUserId
// });

// console.log(matrixClient.getAccessToken());

// 
// console.log("starting");
//    matrixClient.startClient();
