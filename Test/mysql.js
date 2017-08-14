var mysql = require('mysql');
var http = require("http");
var express = require('express');
var app = express();


  var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '3893712nsy',
  database : 'nmsn'
});

connection.connect();

var sql = 'select End_Station_Name as station_name from citibike_tripdata group by End_Station_Name union select Start_Station_Name as station_name from citibike_tripdata group by Start_Station_Name;'
var arr = [];
connection.query(sql, function (error, results, fields) {
  if (error) throw error;
    for (var i = 0; i < results.length; i++) {
        arr[i] = results[i];
    }
    app.get('/', function(req, res) {
        res.send(arr);
    });
});
connection.end();

app.listen(8081);
