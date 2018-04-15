var http = require("http");
var fs = require("fs");
var mysql = require('mysql');
var url = require('url');

var kmeans = require('./node_Kmeans');


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '3893712nsy',
    database: 'nmsn',
});

connection.connect();

var sqlHangZhou = 'SELECT * FROM b_leaseinfohis_hour24ratio';

var arrHangZhou = [];

var arr = [];
var ave = [];
connection.query(sqlHangZhou, function (error, results, fields) {
    if (error) throw error;
    for (var i = 0; i < results.length; i++) {
        arrHangZhou[i] = results[i];
        //console.log(arrHangZhou[i]);
    }
    console.log(arrHangZhou.length);
    console.log(results.length);

    for (var i = 0; i < arrHangZhou.length; i++) {
        arr[i] = {};
        arr[i].arr = [];
        // arrHangZhou[i] = JSON.parse(JSON.stringify(arrHangZhou[i]));

        // console.log(JSON.stringify(arrHangZhou[i]));
        for (var x in arrHangZhou[i]) {
            // console.log(arrHangZhou[i][x]);
            if (x != 'CARDNO') {
                arr[i].arr.push(arrHangZhou[i][x]);
            } else {
                arr[i].cardno = arrHangZhou[i][x];
            }
        }
    }

    arr = kmeans.kmeansGroup(5,arr);
    console.log(arr[0].ave,arr[1].ave,arr[2].ave,arr[3].ave,arr[4].ave);
    console.log('loading succeed');

    for(var i=0;i<arr.length;i++){
       ave[i]= arr[i].ave;
    }

});

connection.end();

console.log(arrHangZhou.length);


function onRequest(request, response) {
    console.log("Request received.");
    response.writeHead(200, {
        "Content-Type": 'text/plain',
        'charset': 'utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
    });//可以解决跨域的请求

    // var dataHangZhou = JSON.stringify(arr);
    if (ave instanceof Object) {
        ave = JSON.stringify(ave);
    }

    switch (url.parse(request.url).query) {
        case 'HangZhou':
            response.write(ave);
            break;
        default:
            response.write("Error");
    }
    response.end();
}

http.createServer(onRequest).listen(8082);

console.log("Server has started.port on 8082\n");
