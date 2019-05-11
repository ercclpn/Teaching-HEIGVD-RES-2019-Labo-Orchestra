/**
 * @author Tran Eric
 */
const protocol = require('./orchestra-protocol');

const dgram = require('dgram');

const uuidv4 = require('uuid/v4');

const instruments = new Map();
instruments.set('piano', 'ti-ta-ti');
instruments.set('trumpet', 'pouet');
instruments.set('flute', 'trulu');
instruments.set('violin', 'gzi-gzi');
instruments.set('drum', 'boum-boum');

const s = dgram.createSocket('udp4');

function Musician(instrument,sound){
  this.uuid = uuidv4();
  this.instrument = instrument;
  this.sound = sound;

  Musician.prototype.update = function(){
    var musician = {
      uuid : this.uuid,
      instrument : this.instrument,
      sound : this.sound,
      time : new Date().toISOString()
    };
    message = new Buffer(JSON.stringify(musician));
    console.log(musician);
    s.send(message,0,message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS);
  }
  setInterval(this.update.bind(this),1000);
}




if (process.argv.length < 3 || process.argv.length > 3) {
  console.log('Error, no parameter');
  process.exit();
}

const param = {
  instrument: process.argv[2],
  sound: instruments.get(process.argv[2]),
};

if (param.sound === undefined) {
  console.log('Error, bad parameter');
  process.exit();
}

var mus = new Musician(param.instrument,param.sound);