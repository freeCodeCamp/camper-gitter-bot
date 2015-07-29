var Scribe = require('../lib/scribe').Scribe;

var scribe = new Scribe("localhost", 3000, { autoReconnect : true });


scribe.open(function(err) {
  if (err) {
    console.log(err);
    return;
  }

  setInterval(function() {
    scribe.send("foo", "bar");
  }, 150);
});

scribe.on('connect', function(){
  console.log("Client connected");
});

scribe.on('reconnecting', function(){
  console.log("Client reconnecting");
});

scribe.on('error', function(err){
  console.log("Error", err);
});
