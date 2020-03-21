/*
In the node.js intro tutorial (http://nodejs.org/), they show a basic tcp 
server, but for some reason omit a client connecting to it.  I added an 
example at the bottom.
Save the following server in example.js:
*/

var net = require('net');
var fs = require('fs');6
var connections = 0;
var server = net.createServer();
server.on('connection', function(socket) {
    socket.on('data',function(data){
        let string = '' + data;
        let arr =  string.split(' ');
        let lat = arr[0];
        let long = arr[1];
        let ip = arr[2];
        ip = ip.trim();

        let json = {
            latitude : lat,
            longitude : long
        }
        try {
            fs.readFile('data.json', (err, data) => {
                if (err) throw err;

                let obj = JSON.parse(data);
                let i = obj[ip];
                if (i == undefined){
                    obj[ip] = [json];
                } else {
                    i.push(json);
                }
                fs.writeFile('data.json', JSON.stringify(obj), (err) => {
                    if (err) throw err;}); 
              });
          } catch(err) {
            console.log(err);
            return;
          }
        console.log(json);
    })
});

server.listen(8000, '192.168.1.103');
