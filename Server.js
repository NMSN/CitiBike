var http = require("http");
var fs = require("fs");
var mysql = require('mysql');
var url = require('url');


var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '3893712nsy',
    database : 'nmsn',
});

connection.connect();

var sqlAll = 'select * from citibike_tripdata;'

var sqlStations ='select end_station_id as station_id,' +
                'end_station_name as station_name,' +
                'end_station_latitude as latitude,' +
                'end_station_longitude as longitude ' +
                'from citibike_tripdata group by end_station_name '+
                'union '+
                'select start_station_id as station_id,' +
                'start_station_name as station_name,' +
                'start_station_latitude as latitude,' +
                'start_station_longitude as longitude ' +
                'from citibike_tripdata group by start_station_name;'

var sqlHeatInfo = 'select start_station_id, ' +
                'start_station_name, ' +
                'start_station_latitude, ' +
                'start_station_longitude ' +
                'from citibike_tripdata; '

var sqlManWork ='select count(*) as num,' +
                'date_format(start_time, "%y-%m-%d" ) as date,' +
                'date_format(start_time, "%h" ) as hour,' +
                'date_format(start_time, "%w" ) as week ' +
                'from citibike_tripdata ' +
                'where gender=1 and ' +
                'dayofweek(start_time)!=1 and ' +
                'dayofweek(start_time)!=7 ' +
                'group by date_format(start_time, "%y-%m-%d %h" ); '//男性工作日情况

var arrStations = [];
var arrHeatInfo = [];
var arrManWork = [];

connection.query(sqlStations , function (error, results, fields) {
    if (error) throw error;
    for (var i = 0; i < results.length; i++) {
        arrStations[i] = results[i];
        //console.log(arrStations[i]);
    }
});
connection.query(sqlHeatInfo , function (error, results, fields) {
    if (error) throw error;
    for (var i = 0; i < results.length; i++) {
        arrHeatInfo[i] = results[i];
        //console.log(arrHeatInfo[i]);
    }
});
connection.query(sqlManWork , function (error, results, fields) {
    if (error) throw error;
    for (var i = 0; i < results.length; i++) {
        arrManWork[i] = results[i];
        //console.log(arrManWork[i]);
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

    var stations = JSON.stringify(arrStations);
    var heatInfo = JSON.stringify(arrHeatInfo);
    var manWork =  JSON.stringify(arrManWork);


/*    console.log(url.parse(request.url).query);//获得请求字段
    console.log(typeof(url.parse(request.url).query));//获得请求体*/

    switch (url.parse(request.url).query){
        case 'stations': response.write(stations); break;
        case 'heatInfo': response.write(heatInfo); break;
        case 'manWork': response.write(manWork); break;
        default: response.write("Error");
    }
    response.end();
}

http.createServer(onRequest).listen(8081);

console.log("Server has started.port on 8081\n");
