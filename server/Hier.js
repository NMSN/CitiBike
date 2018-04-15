var http = require("http");
var fs = require("fs");
var mysql = require('mysql');
var url = require('url');
var cluster = require('hierarchical-clustering');


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '3893712nsy',
    database: 'nmsn',
});

connection.connect();

var sql = 'select * from week_holiratio_full300;'
var arr = [];
var clusters;

connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    for (var i = 0; i < results.length; i++) {
        // arrStations[i] = results[i];
        arr[i] = [];
        for(index in results[i]){
            arr[i].push(results[i][index]);
        }
        // console.log(arr[i]);
        // console.log(results[i]);
    }
    console.log(arr);


// Euclidean distance
    function distance(a, b) {
        var d = 0;
        for (var i = 0; i < a.length; i++) {
            d += Math.pow(a[i] - b[i], 2);
        }
        return Math.sqrt(d);
    }

// Single-linkage clustering
    function linkage(distances) {
        return Math.min.apply(null, distances);
    }

    var levels = cluster({
        input: arr,
        distance: distance,
        linkage: linkage,
        minClusters: 5, // only want two clusters
    });

    clusters = levels[levels.length - 1].clusters;
    // console.log(clusters);

    clusters = clusters.map(function (cluster) {
        return cluster.map(function (index) {
            return arr[index];
        });
    });
     console.log(clusters);
    // clusters.forEach(function(index){
    //     // console.log(index);
    // })

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

    // // var dataHangZhou = JSON.stringify(arr);
    // if (ave instanceof Object) {
    //     ave = JSON.stringify(ave);
    // }

    var result = JSON.stringify(clusters);
    switch (url.parse(request.url).query) {
        case 'arr':
            response.write(result);
            break;
        case 'test':
            response.write(test);
            break;
        default:
            response.write("Error");
    }
    response.end();
}

http.createServer(onRequest).listen(8081);

console.log("Server has started.port on 8081\n");


var colors = [
    [20, 20, 80],
    [22, 22, 90],
    [210, 255, 253],
    [10, 255, 253],
    [250, 22, 253],
    [250, 2, 253],
    [250, 255, 253],
    [250, 3, 253],
    [90, 255, 253],
    [250, 255, 32],
    [250, 255, 27],
    [11, 15, 253],
    [250, 11, 253],
    [250, 255, 253],
    [250, 255, 11],
    [100, 54, 255]
];


