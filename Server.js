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

var sqlAll = 'select * from citibike_tripdata;'

var sqlStations = 'select end_station_id as station_id,' +
    'end_station_name as station_name,' +
    'end_station_latitude as latitude,' +
    'end_station_longitude as longitude ' +
    'from citibike_tripdata group by end_station_name ' +
    'union ' +
    'select start_station_id as station_id,' +
    'start_station_name as station_name,' +
    'start_station_latitude as latitude,' +
    'start_station_longitude as longitude ' +
    'from citibike_tripdata group by start_station_name;'

var sqlHeatInfo = 'select count(*) as count,' +
    'start_station_id,' +
    'start_station_name,' +
    'start_station_latitude,' +
    'start_station_longitude ' +
    'from citibike_tripdata ' +
    'group by start_station_id;'

var sqlManWork = 'select count(*) as num,' +
    'date_format(start_time, "%y-%m-%d %H" ) as date,' +
    'date_format(start_time, "%W" ) as week ' +
    'from citibike_tripdata ' +
    'where gender=1 and ' + //男性
    'dayofweek(start_time)!=1 and ' +
    'dayofweek(start_time)!=7 ' + //工作日
    'group by date_format(start_time, "%y-%m-%d %H" ); '//男性工作日情况

var sqlManRest = 'select count(*) as num,' +
    'date_format(start_time, "%y-%m-%d %H" ) as date,' +
    'date_format(start_time, "%W" ) as week ' +
    'from citibike_tripdata ' +
    'where gender=1 and ' + //男性
    'dayofweek(start_time)=1 or ' + //
    'dayofweek(start_time)=7 ' +
    'group by date_format(start_time, "%y-%m-%d %H" ); '//男性周末情况

var sqlWomanWork = 'select count(*) as num,' +
    'date_format(start_time, "%y-%m-%d %H" ) as date,' +
    'date_format(start_time, "%W" ) as week ' +
    'from citibike_tripdata ' +
    'where gender=2 and ' +
    'dayofweek(start_time)!=1 and ' +
    'dayofweek(start_time)!=7 ' +
    'group by date_format(start_time, "%y-%m-%d %H" ); '//女性工作日情况

var sqlWomanRest = 'select count(*) as num,' +
    'date_format(start_time, "%y-%m-%d %H" ) as date,' +
    'date_format(start_time, "%W" ) as week ' +
    'from citibike_tripdata ' +
    'where gender=2 and ' + //女性
    'dayofweek(start_time)=1 or ' + //
    'dayofweek(start_time)=7 ' +
    'group by date_format(start_time, "%y-%m-%d %H" ); '//女性周末情况


/*------------------------------------------------------------------------------*/

var sqlManWork24 = 'SELECT count(*) as num, date_format(start_time, "%H" ) as date ' +
    'FROM `citibike_tripdata` ' +
    'WHERE gender=1 ' +
    'AND  dayofweek(start_time)!=1 ' +
    'AND  dayofweek(start_time)!=7 ' +
    'GROUP BY date_format(start_time, "%H" ) ;'
var sqlManRest24 = 'SELECT count(*) as num, date_format(start_time, "%H" ) as date ' +
    'FROM `citibike_tripdata` ' +
    'WHERE gender=1 ' +
    'AND	dayofweek(start_time)=1 ' +
    'OR  dayofweek(start_time)=7 ' +
    'GROUP BY date_format(start_time, "%H" ) ;'
var sqlWomanWork24 = 'SELECT count(*) as num, date_format(start_time, "%H" ) as date ' +
    'FROM `citibike_tripdata` ' +
    'WHERE gender=2 ' +
    'AND	dayofweek(start_time)!=1 ' +
    'AND  dayofweek(start_time)!=7 ' +
    'GROUP BY date_format(start_time, "%H" ) ;'
var sqlWomanRest24 = 'SELECT count(*) as num, date_format(start_time, "%H" ) as date ' +
    'FROM `citibike_tripdata` ' +
    'WHERE gender=2 ' +
    'AND	dayofweek(start_time)=1 ' +
    'OR  dayofweek(start_time)=7 ' +
    'GROUP BY date_format(start_time, "%H" ) ;'

var arrStations = [];
var arrHeatInfo = [];
var arrManWork = [];
var arrManRest = [];
var arrWomanWork = [];
var arrWomanRest = [];

connection.query(sqlStations, function (error, results, fields) {
    if (error) throw error;
    for (var i = 0; i < results.length; i++) {
        arrStations[i] = results[i];
        //console.log(arrStations[i]);
    }
});
connection.query(sqlHeatInfo, function (error, results, fields) {
    if (error) throw error;
    for (var i = 0; i < results.length; i++) {
        arrHeatInfo[i] = results[i];
        //console.log(arrHeatInfo[i]);
    }
});
connection.query(sqlManWork24, function (error, results, fields) {
    if (error) throw error;
    for (var i = 0; i < results.length; i++) {
        arrManWork[i] = results[i];
        console.log(arrManWork[i]);
    }
});
connection.query(sqlManRest24, function (error, results, fields) {
    if (error) throw error;
    for (var i = 0; i < results.length; i++) {
        arrManRest[i] = results[i];
        //console.log(arrManRest[i]);
    }
});
connection.query(sqlWomanWork24, function (error, results, fields) {
    if (error) throw error;
    for (var i = 0; i < results.length; i++) {
        arrWomanWork[i] = results[i];
        //console.log(arrWomanWork[i]);
    }
});
connection.query(sqlWomanRest24, function (error, results, fields) {
    if (error) throw error;
    for (var i = 0; i < results.length; i++) {
        arrWomanRest[i] = results[i];
        //console.log(arrWomanRest[i]);
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

    var stations = JSON.stringify(arrStations);
    var heatInfo = JSON.stringify(arrHeatInfo);
    var manWork = JSON.stringify(arrManWork);
    var manRest = JSON.stringify(arrManRest);
    var womanWork = JSON.stringify(arrWomanWork);
    var womanRest = JSON.stringify(arrWomanRest);


    /*    console.log(url.parse(request.url).query);//获得请求字段
        console.log(typeof(url.parse(request.url).query));//获得请求体*/

    switch (url.parse(request.url).query) {
        case 'stations':
            response.write(stations);
            break;
        case 'heatInfo':
            response.write(heatInfo);
            break;
        case 'manWork':
            response.write(manWork);
            break;
        case 'manRest':
            response.write(manRest);
            break;
        case 'womanWork':
            response.write(womanWork);
            break;
        case 'womanRest':
            response.write(womanRest);
            break;
        default:
            response.write("Error");
    }
    response.end();
}

http.createServer(onRequest).listen(8081);

console.log("Server has started.port on 8081\n");
