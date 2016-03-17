var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var sdk = require("matrix-js-sdk");
var async = require("async");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var matrixClient;
var roomlist;
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
});

app.get('/roomNames',function (req, res) {
  console.log("Get request");

  var rooms = matrixClient.getRooms();
  var roomNames = [];
  for(var i=0;i<rooms.length;i++){
    roomNames.push(rooms[i].name);
  }
  res.json(roomNames);
  
});

app.post('/roomData',function (req, res) {
  console.log("Post request");

  var rooms = matrixClient.getRooms();
  var history = [];
  for(var i=0;i<rooms.length;i++){
    var events = rooms[i].getLiveTimeline()._events;
    var data = []; 
    for(var j=0;j<events.length;j++){
      if(events[j].getContent().body!=undefined)
        data.push({"content":events[j].getContent().body, "sender": events[j].getSender()});
    }
    // history.push({"room":rooms[i].name,"data":data});
    history.push(data);
  }
  console.log(history);
  res.json(history);
});

app.listen(3000);
console.log("server on port 3000");

// // var clc = require("cli-color");
// var matrixClient = sdk.createClient({
//     baseUrl: "http://localhost:8008",
//     accessToken: myAccessToken,
//     userId: myUserId
// });


// matrixClient.on("Room.timeline", function(event, room, toStartOfTimeline) {
//        if (toStartOfTimeline) {
//            return; // don't print paginated results
//        }
//        if (event.getType() !== "m.room.message") {
//            return; // only print messages
//        }
//        console.log(
//            // the room name will update with m.room.name events automatically
//            "(%s) %s :: %s", room.name, event.getSender(), event.getContent().body
//        );
//    });
// console.log("starting");
//    matrixClient.startClient();
