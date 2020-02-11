var express = require('express');
var app = express();
var path = require('path');
app.use(express.static(__dirname));

app.get('/', function (req, res) {
    idn = String(req.params.id);
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.get('/:id', function (req, res) {
    idn = String(req.params.id);
    res.sendFile(path.join(__dirname + "/" + idn));
});

app.listen(3000, function () {
  console.log('App listening on port 3000');
});