var http = require("http");
var fs = require("fs");
var mysql = require('mysql');


var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '3893712nsy',
    database : 'nmsn',
});

connection.connect();

var sql ='select end_station_name as station_name,' + /*联表有问题*/
        'end_station_latitude as latitude,' +
        'end_station_longitude as longitude ' +
        'from citibike_tripdata group by end_station_name;'
        /*'union'+
        'select start_station_name as station_name,' +
        'start_station_latitude as latitude,' +
        'start_station_longitude as longitude ' +
        'from citibike_tripdata group by start_station_name;'/*/
var arr = [];
connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    for (var i = 0; i < results.length; i++) {
        arr[i] = results[i];
        console.log(arr[i]);
    }
});
connection.end();


function onRequest(request, response){
    console.log("Request received.");
    response.writeHead(200,{
        "Content-Type":'text/plain',
        'charset':'utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'
    });//可以解决跨域的请求

    var stations = JSON.stringify(arr);
    //str=fs.readFileSync('data.txt');
    //response.write("hello");
    response.end(stations);
}

http.createServer(onRequest).listen(8081);

console.log("Server has started.port on 8081\n");
