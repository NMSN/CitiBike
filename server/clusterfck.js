var http = require('http');
// var fs = require('fs');
var mysql = require('mysql');
var url = require('url');
var kmeanself = require('./kmeans');
var diana = require('./diana');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '3893712nsy',
    database: 'nmsn',
});

connection.connect();

var sqlCountAllInfo = 'select count(*) from b_leaseinfohis_brief201405';
var sqlCountAllUsers = 'select count(*) from week_holiratio201405';
var sqlCountDays = 'select count(distinct leaseday) from b_leaseinfohis_brief201405';


// var sqlCount0_10 = 'select count(*) from week_holiratio201405 where sum<10;';
// var sqlCount10_20 = 'select count(*) from week_holiratio201405 where sum>=10 and sum<20;';
// var sqlCount20_30 = 'select count(*) from week_holiratio201405 where sum>=20 and sum<30;';
// var sqlCount30_40 = 'select count(*) from week_holiratio201405 where sum>=30 and sum<40;';
// var sqlCount40_50 = 'select count(*) from week_holiratio201405 where sum>=40 and sum<50;';
// var sqlCount50_75 = 'select count(*) from week_holiratio201405 where sum>=50 and sum<75;';
// var sqlCount75_100 = 'select count(*) from week_holiratio201405 where sum>=75 and sum<100;';
// var sqlCount100_150 = 'select count(*) from week_holiratio201405 where sum>=100 and sum<150;';
// var sqlCount150_200 = 'select count(*) from week_holiratio201405 where sum>=150 and sum<200;';
// var sqlCount200_ = 'select count(*) from week_holiratio201405 where sum>=200;';





var sqlRatio10_20 = 'select CARDNO,X1,X2,X3,X4,X5,X6,X7,XHOLI from week_holiratio201405 where sum>=10 and sum<20;';
var sqlRatio20_30 = 'select CARDNO,X1,X2,X3,X4,X5,X6,X7,XHOLI from week_holiratio201405 where sum>=20 and sum<30;';
var sqlRatio30_40 = 'select CARDNO,X1,X2,X3,X4,X5,X6,X7,XHOLI from week_holiratio201405 where sum>=30 and sum<40;';
var sqlRatio40_50 = 'select CARDNO,X1,X2,X3,X4,X5,X6,X7,XHOLI from week_holiratio201405 where sum>=40 and sum<50;';
var sqlRatio50_75 = 'select CARDNO,X1,X2,X3,X4,X5,X6,X7,XHOLI from week_holiratio201405 where sum>=50 and sum<75;';
var sqlRatio75_100 = 'select CARDNO,X1,X2,X3,X4,X5,X6,X7,XHOLI from week_holiratio201405 where sum>=75 and sum<100;';
var sqlRatio100_150 = 'select CARDNO,X1,X2,X3,X4,X5,X6,X7,XHOLI from week_holiratio201405 where sum>=100 and sum<150;';
var sqlRatio150_200 = 'select CARDNO,X1,X2,X3,X4,X5,X6,X7,XHOLI from week_holiratio201405 where sum>=150 and sum<200;';
var sqlRatio200_ = 'select CARDNO,X1,X2,X3,X4,X5,X6,X7,XHOLI from week_holiratio201405 where sum>=200;';


var hsqlRatio20_50 = 'select CARDNO,HOUR6,HOUR7,HOUR8,HOUR9,HOUR10,HOUR11,HOUR12,HOUR13,HOUR14,HOUR15,HOUR16,HOUR17,HOUR18,HOUR19,HOUR20,HOUR21 from hour24ratio_full where sum>=20 and sum<50;';
var hsqlRatio50_100 = 'select CARDNO,HOUR6,HOUR7,HOUR8,HOUR9,HOUR10,HOUR11,HOUR12,HOUR13,HOUR14,HOUR15,HOUR16,HOUR17,HOUR18,HOUR19,HOUR20,HOUR21 from hour24ratio_full where sum>=50 and sum<100;';
var hsqlRatio100_150 = 'select CARDNO,HOUR6,HOUR7,HOUR8,HOUR9,HOUR10,HOUR11,HOUR12,HOUR13,HOUR14,HOUR15,HOUR16,HOUR17,HOUR18,HOUR19,HOUR20,HOUR21 from hour24ratio_full where sum>=100 and sum<150;';
var hsqlRatio150_200 = 'select CARDNO,HOUR6,HOUR7,HOUR8,HOUR9,HOUR10,HOUR11,HOUR12,HOUR13,HOUR14,HOUR15,HOUR16,HOUR17,HOUR18,HOUR19,HOUR20,HOUR21 from hour24ratio_full where sum>=150 and sum<200;';
var hsqlRatio200_250 = 'select CARDNO,HOUR6,HOUR7,HOUR8,HOUR9,HOUR10,HOUR11,HOUR12,HOUR13,HOUR14,HOUR15,HOUR16,HOUR17,HOUR18,HOUR19,HOUR20,HOUR21 from hour24ratio_full where sum>=200 and sum<250;';
var hsqlRatio250_300 = 'select CARDNO,HOUR6,HOUR7,HOUR8,HOUR9,HOUR10,HOUR11,HOUR12,HOUR13,HOUR14,HOUR15,HOUR16,HOUR17,HOUR18,HOUR19,HOUR20,HOUR21 from hour24ratio_full where sum>=250 and sum<300;';
var hsqlRatio300_ = 'select CARDNO,HOUR6,HOUR7,HOUR8,HOUR9,HOUR10,HOUR11,HOUR12,HOUR13,HOUR14,HOUR15,HOUR16,HOUR17,HOUR18,HOUR19,HOUR20,HOUR21 from hour24ratio_full where sum>=300;';


var result;

var self = [];
var selfArr = [];

var idArr = [];
var idArr2 = [];

var self2 = [];
var selfArr2 = [];

var category;//K值

var initCount = {};

var method;


function onRequest(request, response) {
    console.log("Request received.");
    response.writeHead(200, {
        "Content-Type": 'text/plain',
        'charset': 'utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
    });//可以解决跨域的请求
    // console.log(url.parse(request.url,true).query);
    var ajaxObj = url.parse(request.url, true).query;
    console.log(ajaxObj);
    if (ajaxObj.init) {
        var resultCount = JSON.stringify(initCount);
        response.write(resultCount);
        response.end();
    }
    if (ajaxObj.category) {
        category = ajaxObj.category;
        var option = ajaxObj.option;
        console.log(option);
        method = ajaxObj.method;
        var sqlWeek;
        switch (option) {
            case '1':
                sqlWeek = sqlRatio10_20;
                break;
            case '2':
                sqlWeek = sqlRatio20_30;
                break;
            case '3':
                sqlWeek = sqlRatio30_40;
                break;
            case '4':
                sqlWeek = sqlRatio40_50;
                break;
            case '5':
                sqlWeek = sqlRatio50_75;
                break;
            case '6':
                sqlWeek = sqlRatio75_100;
                break;
            case '7':
                sqlWeek = sqlRatio100_150;
                break;
            case '8':
                sqlWeek = sqlRatio150_200;
                break;
            case '9':
                sqlWeek = sqlRatio200_;
                break;
            default:
                console.log('switch error', option);
        }


        // console.log(sqlWeek);
        connection.query(sqlWeek, function (error, results, fields) {//第一次聚类
            if (error) throw error;
            self = [];
            for (var i = 0; i < results.length; i++) {
                self[i] = results[i];
                // console.log(self[i]);
            }
            selfArr = [];
            for (var i = 0; i < self.length; i++) {
                selfArr[i] = {};
                selfArr[i].arr = [];
                for (var index in self[i]) {
                    // console.log(self[i][x]);
                    if (index == 'cardno' || index == 'CARDNO') {
                        selfArr[i].cardno = self[i][index];
                    } else {
                        selfArr[i].arr.push(self[i][index]);
                    }
                }
            }
            // console.log('selfArr',selfArr);
            var clusters;
            if(method == 1){
                console.log('k-means');
                clusters = kmeanself.kmeansGroup(selfArr,ajaxObj.category);
            }
            if(method == 2){
                console.log('diana');
                clusters = diana.dianaGroup(selfArr, ajaxObj.category);
            }

            result = {
                clusters: clusters.arrGroup,
                ave: clusters.ave,
                stations: []
            };
            // var resultOut = JSON.stringify(result);
            for (var i = 0; i < result.clusters.length; i++) {
                idArr[i] = [];
                result.clusters[i].forEach(function (e) {
                    idArr[i].push(e.cardno);
                });
            }
            // console.log(idArr[i]);

            var resultOut = JSON.stringify(result);
            response.write(resultOut);
            response.end();
        });
    }
    if (ajaxObj.idArr) {
        var stations = [];
        for (var i = 0; i < idArr.length; i++) {
            var sqlCoords = `select leasestation,STATIONNAME,BAIDU_X,BAIDU_Y,SUM from baidu_xy a
                        join (
                            select count(*) as sum,LEASESTATION from b_leaseinfohis_brief201405
                        where cardno in (${idArr[i]})
                        group by LEASESTATION) b
                        on a.STATIONID = b.LEASESTATION;`;

            connection.query(sqlCoords, function (error, results, fields) {
                if (error) throw error;
                // var index = i;
                console.log(results);
                // console.log(i);
                stations.push(results);
                if (stations.length >= idArr.length) {
                    var resultOut = JSON.stringify(stations);
                    response.write(resultOut);
                    response.end();
                }
            });
        }
    }
    if (ajaxObj.seriesIndex) {
        var seriesIndex = ajaxObj.seriesIndex;
        // connection.connect();
        var instring = "'" + idArr[seriesIndex].join("','") + "'";
        // var sqlHour = ' select * from hour24ratio_full300 '+
        var sqlHour = `select CARDNO,HOUR6,HOUR7,HOUR8,HOUR9,HOUR10,HOUR11,HOUR12,HOUR13,HOUR14,HOUR15,HOUR16,HOUR17,HOUR18,HOUR19,HOUR20,HOUR21
             from hourratio201405 
            where cardno in (${instring})`;

        connection.query(sqlHour, function (error, results, fields) {
            if (error) throw error;
            self2 = [];
            for (var i = 0; i < results.length; i++) {
                self2[i] = results[i];
            }
            selfArr2 = [];
            for (var i = 0; i < self2.length; i++) {
                selfArr2[i] = {};
                selfArr2[i].arr = [];
                for (var index in self2[i]) {
                    // console.log(self[i][x]);
                    if (index == 'cardno' || index == 'CARDNO') {
                        selfArr2[i].cardno = self2[i][index];
                    } else {
                        selfArr2[i].arr.push(self2[i][index]);
                    }
                }
            }
            var arrOut2 = JSON.stringify(selfArr2);
            var clustersHour;
            if(method == 1){
                clustersHour = kmeanself.kmeansGroup(selfArr2, category);
            }
            if(method == 2){
                clustersHour = diana.dianaGroup(selfArr2, category);
            }

            clustersHour = {
                clusters: clustersHour.arrGroup,
                ave: clustersHour.ave
            }
            var resultHour = JSON.stringify(clustersHour);

            response.write(resultHour);
            response.end();
        });
        // connection.end();

    }


}

http.createServer(onRequest).listen(8082);

console.log("Server has started.port on 8082\n");













