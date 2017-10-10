var http = require("http");
var fs = require("fs");
var mysql = require('mysql');
var url = require('url');


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '3893712nsy',
    database: 'nmsn',
});

connection.connect();

var sqlHangZhou = 'SELECT * FROM b_leaseinfohis_hour24';

var arrHangZhou = [];

connection.query(sqlHangZhou, function (error, results, fields) {
    if (error) throw error;
    for (var i = 0; i < results.length; i++) {
        arrHangZhou[i] = results[i];
        //console.log(arrHangZhou[i]);
    }
});
connection.end();


function onRequest(request, response) {
    console.log("Request received.");
    response.writeHead(200, {
        "Content-Type": 'text/plain',
        'charset': 'utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
    });//可以解决跨域的请求

    var dataHangZhou = JSON.stringify(arrHangZhou);


    switch (url.parse(request.url).query) {
        case 'HangZhou':
            response.write(dataHangZhou);
            break;
        default:
            response.write("Error");
    }
    response.end();
}

http.createServer(onRequest).listen(8082);

console.log("Server has started.port on 8082\n");
