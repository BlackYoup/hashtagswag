var express = require('express');
var app = express();
var path = require('path');

app.use(express.static("public"));

app.get('/', function(req, res){
  res.sendFile(path.resolve("public/index.html"));
});

app.listen(parseInt(process.env.PORT) || 8080, function(){
  console.log('LISTENING');
});
