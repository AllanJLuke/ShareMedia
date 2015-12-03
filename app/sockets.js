var mongoose = require('mongoose');

var updateInterval = 2000;
var io;
var Class = function(ioParam) {
    mongoose.connect('mongodb://comp3203:3203@ds031627.mongolab.com:31627/sharemedia');
    var roomSchema = mongoose.Schema({
        text: String,
        roomPath: String
    });


    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        console.log("DB!");
    });

    var Room = mongoose.model("Room",roomSchema);






    io = ioParam;

    io.on("connection",function(socket){

       socket.on("room",function(data)
       {

           data = data.trim().toLowerCase();
           if (data.substring(0, 1) == '/') {
               data = data.substring(1);
           }

           socket.join(data);
          Room.find({ "roomPath": data }, function(err,rooms)
          {
              if (rooms.length === 0) {
                  var newRoom = new Room({
                      text: "Fueled by Tim Hortons.",
                      roomPath: data
                  });


                  newRoom.save(function (err, newRoom) {
                      if (err) return console.error(err);
                      console.log(newRoom.roomPath + " CREATED");
                      socket.emit("text",newRoom.text);
                  });
                  socket.room = newRoom;
              }
              else{
                  socket.room = rooms[0];
                  socket.emit("text",socket.room.text);
              }

          });
       });

       socket.on("text",function(data){


           console.log("GOT TEXTT");
           console.log(data);
           socket.room.text = data;
           //BEING SENT TO EVERYONE!!!!
           socket.broadcast.to(socket.room.roomPath).emit("text",data);

           //THIS SHOULD HAVE A TIME OUT
           socket.room.save();

       });
    });
};

module.exports = Class;
