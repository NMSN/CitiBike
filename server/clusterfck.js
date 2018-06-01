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

const sqlArr = [
    'sum>=10 and sum<20',
    'sum>=20 and sum<30',
    'sum>=30 and sum<40',
    'sum>=40 and sum<50',
    'sum>=50 and sum<75',
    'sum>=75 and sum<100',
    'sum>=100 and sum<150',
    'sum>=150 and sum<200',
    'sum>=200',

];

var result;

var self = [];
var selfArr = [];

var idArr = [];
var idArr2 = [];

var self2 = [];
var selfArr2 = [];

var category;// K值

var initCount = {};

var method;

var usage; // 借还车方式


function onRequest(request, response) {
    console.log("Request received.");
    response.writeHead(200, {
        "Content-Type": 'text/html',
        'charset': 'utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
    });//可以解决跨域的请求
    // console.log(url.parse(request.url,true).query);
    var ajaxObj = url.parse(request.url, true).query;
    // console.log(ajaxObj);
    if (ajaxObj.init) {
        var resultCount = JSON.stringify(initCount);
        response.write(resultCount);
        response.end();
    }
    /* 根据星期情况聚类 */
    if (ajaxObj.category) {
        category = ajaxObj.category; // 层次数
        var option = ajaxObj.option; // 用户使用量层次
        // console.log(option);
        method = ajaxObj.method; // 聚类算法
        usage = ajaxObj.usage; // 借还车
        
        var sqlWeek;
        if(usage === 1) {
            sqlWeek = `select * from week_holiratio201405 where ${sqlArr[option - 1]} ORDER BY SUM desc;`
        } else {
            sqlWeek = `select * from week_holiratio201405r where ${sqlArr[option - 1]} ORDER BY SUM desc;`
        }
        console.log(sqlWeek);

        connection.query(sqlWeek, function (error, results, fields) {//第一次聚类
            if (error) throw error;
            self = [];
            for (var i = 0; i < results.length; i++) {
                self[i] = results[i];
                delete self[i].SUM;
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
            console.log('selfArr',selfArr);
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
    /* 获取站点聚类结果 */
    if (ajaxObj.idArr) {
        var stations = [];
        for (var i = 0; i < idArr.length; i++) {
            var sqlCoords;
            if (usage === 1) {
                sqlCoords = `select leasestation,STATIONNAME,BAIDU_X,BAIDU_Y,SUM from baidu_xy a
                    join (
                        select count(*) as sum,LEASESTATION from b_leaseinfohis_brief201405
                    where cardno in (${idArr[i]})
                    group by LEASESTATION) b
                    on a.STATIONID = b.LEASESTATION;`;
            } else {
                sqlCoords = `select returnstation,STATIONNAME,BAIDU_X,BAIDU_Y,SUM from baidu_xy a
                    join (
                        select count(*) as sum,RETURNSTATION from b_leaseinfohis_brief201405
                    where cardno in (${idArr[i]})
                    group by RETURNSTATION) b
                    on a.STATIONID = b.RETURNSTATION;`;
            }
            console.log(sqlCoords);
            connection.query(sqlCoords, function (error, results, fields) {
                if (error) throw error;
                // var index = i;
                // console.log(results);
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
    /* 第二次聚类 */
    if (ajaxObj.seriesIndex) {
        var seriesIndex = ajaxObj.seriesIndex;
        var instring = "'" + idArr[seriesIndex].join("','") + "'";
        var sqlHour;
        if (usage === 1) {
            sqlHour = `select *
                from hourratio201405 
            where cardno in (${instring})`;
        } else {
            sqlHour = `select *
                from hourratio201405r
            where cardno in (${instring})`;
        }
        console.log(sqlHour);
        connection.query(sqlHour, function (error, results, fields) {
            if (error) throw error;
            self2 = [];
            for (var i = 0; i < results.length; i++) {
                self2[i] = results[i];
                delete self2[i].SUM;
                console.log(self2[i]);
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

            for (var i = 0; i < result.clusters.length; i++) {
                idArr[i] = [];
                result.clusters[i].forEach(function (e) {
                    idArr[i].push(e.cardno);
                });
            }
            
            var resultHour = JSON.stringify(clustersHour);
            response.write(resultHour);
            response.end();
        });
        // connection.end();

    }
    /* 查询人相关信息 */
    if (ajaxObj.usrIndex) {
        const userId = ajaxObj.usrIndex;
        const sqlLease = `select leasestation,STATIONNAME,BAIDU_X,BAIDU_Y,SUM from baidu_xy a
                        join (
                            select count(*) as sum,LEASESTATION from b_leaseinfohis_brief201405
                        where cardno = ${userId}
                        group by LEASESTATION) b
                        on a.STATIONID = b.LEASESTATION order by SUM desc;`;
        const result  = {};
        // const sql = `select * from week_holi_201405 where CARDNO = ${userId}`;
        connection.query(sqlLease, function (error, results, fields) {
            if (error) throw error;
            result.lease = [];
            for (let i = 0; i < results.length; i++) {
                result.lease[i] = results[i];
            }
            const sqlReturn = `select returnstation,STATIONNAME,BAIDU_X,BAIDU_Y,SUM from baidu_xy a
                        join (
                            select count(*) as sum,RETURNSTATION from b_leaseinfohis_brief201405
                        where cardno = ${userId}
                        group by RETURNSTATION) b
                        on a.STATIONID = b.RETURNSTATION order by SUM desc;`;
            connection.query(sqlReturn, function (error, results, fields) {
                if (error) throw error;
                result.return = [];
                for (let i = 0; i < results.length; i++) {
                    result.return[i] = results[i];
                    // console.log(results[i]);

                }
            const res = JSON.stringify(result);
            response.write(JSON.stringify(result),'utf-8');
            response.end();
            });
        });
    }
    if (ajaxObj.heatmapTime) {
        const startTime = ajaxObj.heatmapTime.split('~')[0];
        const endTime = ajaxObj.heatmapTime.split('~')[1];
        const cardno = ajaxObj.cardno;
        const usage = ajaxObj.usage;
        console.log(startTime, endTime, usage);
        
        const sqlLease = `select leasestation as stationId, count(*) as sum from b_leaseinfohis_brief201405
            where DATE_FORMAT(LEASETIME,'%Y %m %d %H %i %S') > DATE_FORMAT('${startTime} 00:01:02','%Y %m %d %H %i %S') 
            and DATE_FORMAT(LEASETIME,'%Y %m %d %H %i %S') < DATE_FORMAT('${endTime}','%Y %m %d %H %i %S') 
            ${cardno ? `and cardno = ${cardno}`: ''}
            group by stationId`;
        const sqlReturn = `select returnstation as stationId, count(*) as sum from b_leaseinfohis_brief201405
        where DATE_FORMAT(RETURNTIME,'%Y %m %d %H %i %S') > DATE_FORMAT('${startTime} 00:01:02','%Y %m %d %H %i %S') 
        and DATE_FORMAT(RETURNTIME,'%Y %m %d %H %i %S') < DATE_FORMAT('${endTime}','%Y %m %d %H %i %S') 
        ${cardno ? `and cardno = ${cardno}`: ''}
        group by stationId`;
        const result  = [];
        const sql = usage === 1 ? sqlLease : sqlReturn;
        console.log(sql);
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            for (let i = 0; i < results.length; i++) {
                result[i] = results[i];
            }
            response.write(JSON.stringify(result,'utf-8'));
            response.end();
        });
        
    }

}

http.createServer(onRequest).listen(8082);

console.log("Server has started.port on 8082\n");













