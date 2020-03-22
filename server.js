/*
In the node.js intro tutorial (http://nodejs.org/), they show a basic tcp 
server, but for some reason omit a client connecting to it.  I added an 
example at the bottom.
Save the following server in example.js:
*/

var net = require('net');
var fs = require('fs');
var connections = 0;
var server = net.createServer();
server.on('listening', function(){
	fs.writeFile('data.json',"{}",(err)=>{
		if (err) throw err;
	});
});
server.on('connection', function(socket) {
    socket.on('error',(error) =>{
        console.log("Caught the error");
        return;
    });
    socket.on('data',function(data){
        let string = data.toString().substr(2);
        let arr =  string.split('/');

        let lat = arr[0];
	let long = arr[1];
        let ip = socket.remoteAddress;
	let id = arr[2];

        let json = {
            latitude : lat,
            longitude : long,
	    clientID : id
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

server.listen(8000, '172.31.22.207');
