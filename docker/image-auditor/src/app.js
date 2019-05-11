/**
 * @author Tran Eric
 */
const protocol = require('./orchestra-protocol');

const dgram = require('dgram');

const net = require('net')

var musicMap = new Map();


// UDP Listener
const s = dgram.createSocket('udp4');

s.bind(protocol.PROTOCOL_PORT, function(){
  console.log('Joining multicast group ' + protocol.PROTOCOL_MULTICAST_ADDRESS);
  s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});


s.on('message',function(msg, source){
  var conv = JSON.parse(msg.toString());
  musicMap.set(conv.uuid,conv);
  //console.log(musicMap.size);
});

// TCP Server

const server = net.createServer();


server.on('listening', callBackSocketBound);
server.on('connection', callBackSocketProcess);


server.listen(2205);

function callBackSocketBound(){
  console.log('Listening');
}

function callBackSocketProcess(socket){
  var resultArray = [];
  musicMap.forEach(function(value,key,map){
    resultArray.push(value);
  });
  result = JSON.stringify(resultArray);
  console.log(result);
  socket.write(result);
  socket.destroy();
}

//Analyse musician
function analyseMusician(){
  console.log(musicMap.size);
  musicMap.forEach(function(value,key,map){
    delta = (new Date()).getTime() - (new Date(value.time)).getTime();
    console.log(delta);
    if(delta > 5000){
      console.log(value.uuid + ' has been deleted');
      musicMap.delete(value.uuid);
    }
  });
}

setInterval(analyseMusician,500);