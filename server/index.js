var http = require('http');
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

var sqlWeekResult = []; // week数据库查询结果
var weekClusterParams = []; // week聚类参数

var sqlHourResult = []; // hour数据库查询结果
var hourClusterParams = []; // hour聚类参数

var idArr = []; // 用户id集合

var category; // K值

var method; // 聚类算法选择

var usage; // 借还车方式


function onRequest(request, response) {
    console.log("Request received.");
    response.writeHead(200, {
        "Content-Type": 'text/html',
        'charset': 'utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
    });// CORS
    var ajaxObj = url.parse(request.url, true).query;

    /* 根据星期情况聚类 */
    if (ajaxObj.category) {
        category = ajaxObj.category; // 层次数
        var option = ajaxObj.option; // 用户使用量层次
        method = ajaxObj.method; // 聚类算法
        usage = ajaxObj.usage; // 借还车
        
        var sqlWeek;
        if(usage === '1') {
            sqlWeek = `select * from week_holiratio201405 where ${sqlArr[option - 1]} ORDER BY SUM desc;`
        } else {
            sqlWeek = `select * from week_holiratio201405r where ${sqlArr[option - 1]} ORDER BY SUM desc;`
        }
        console.log(`sqlWeek: ${usage}, sql: ${sqlWeek}`);
        console.time('sqlWeek');
        connection.query(sqlWeek, function (error, results, fields) {// 星期聚类
            if (error) throw error;
            sqlWeekResult = [];
            for (var i = 0; i < results.length; i++) {
                sqlWeekResult[i] = results[i];
                delete sqlWeekResult[i].SUM;
            }
            weekClusterParams = [];
            for (var i = 0; i < sqlWeekResult.length; i++) {
                weekClusterParams[i] = {};
                weekClusterParams[i].arr = [];
                for (var index in sqlWeekResult[i]) {
                    if (index == 'cardno' || index == 'CARDNO') {
                        weekClusterParams[i].cardno = sqlWeekResult[i][index];
                    } else {
                        weekClusterParams[i].arr.push(sqlWeekResult[i][index]);
                    }
                }
            }
            var clusters;
            if(method == 1){
                console.time('k-means');
                clusters = kmeanself.kmeansGroup(weekClusterParams,ajaxObj.category);
                console.timeEnd('k-means');
            }
            if(method == 2){
                console.time('diana');
                clusters = diana.dianaGroup(weekClusterParams, ajaxObj.category);
                console.timeEnd('diana');
            }

            const result = {
                clusters: clusters.arrGroup,
                ave: clusters.ave,  
            };
            idArr = [];
            for (var i = 0; i < result.clusters.length; i++) {
                idArr[i] = [];
                result.clusters[i].forEach(function (e) {
                    idArr[i].push(e.cardno);
                });
            }

            var resultOut = JSON.stringify(result);
            response.write(resultOut);
            console.timeEnd('sqlWeek');
            response.end();
        });
    }
    /* 小时聚类 */
    if (ajaxObj.seriesIndex) {
        var seriesIndex = ajaxObj.seriesIndex;
        var instring = "'" + idArr[seriesIndex].join("','") + "'";
        var sqlHour;
        if (usage === '1') {
            sqlHour = `select *
                from hourratio201405 
            where cardno in (${instring})`;
        } else {
            sqlHour = `select *
                from hourratio201405r
            where cardno in (${instring})`;
        }
        console.log(`sqlHour: ${usage}, sql: ${sqlHour}`);
        console.time('sqlHour');
        connection.query(sqlHour, function (error, results, fields) {
            if (error) throw error;
            sqlHourResult = [];
            for (var i = 0; i < results.length; i++) {
                sqlHourResult[i] = results[i];
                delete sqlHourResult[i].SUM;
            }
            hourClusterParams = [];
            for (var i = 0; i < sqlHourResult.length; i++) {
                hourClusterParams[i] = {};
                hourClusterParams[i].arr = [];
                for (var index in sqlHourResult[i]) {
                    if (index == 'cardno' || index == 'CARDNO') {
                        hourClusterParams[i].cardno = sqlHourResult[i][index];
                    } else {
                        hourClusterParams[i].arr.push(sqlHourResult[i][index]);
                    }
                }
            }
            var arrOut2 = JSON.stringify(hourClusterParams);
            var clustersHour;
            if(method == 1){
                console.time('k-means');
                clustersHour = kmeanself.kmeansGroup(hourClusterParams, category);
                console.timeEnd('k-means');
            }
            if(method == 2){
                console.time('diana');
                clustersHour = diana.dianaGroup(hourClusterParams, category);
                console.timeEnd('diana');
            }
            const result = {
                clusters: clustersHour.arrGroup,
                ave: clustersHour.ave
            };
            idArr = [];
            for (var i = 0; i < result.clusters.length; i++) {
                idArr[i] = [];
                result.clusters[i].forEach(function (e) {
                    idArr[i].push(e.cardno);
                });
            }
            
            var resultHour = JSON.stringify(result);
            response.write(resultHour);
            console.timeEnd('sqlHour');
            response.end();
        });
        // connection.end();

    }
    /* 获取站点聚类结果 */
    if (ajaxObj.idArr) {
        var stations = [];
        for (var i = 0; i < idArr.length; i++) {
            var sqlCoords;
            if (usage === '1') {
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
            console.log(`sqlCoords: ${usage}, sql: ${sqlCoords}`);
            console.time('sqlCoords');
            connection.query(sqlCoords, function (error, results, fields) {
                if (error) throw error;
                stations.push(results);
                if (stations.length >= idArr.length) {
                    var resultOut = JSON.stringify(stations);
                    response.write(resultOut);
                    console.timeEnd('sqlCoords');
                    response.end();
                }
            });
        }
    }
    /* 查询个人使用情况分布 */
    if (ajaxObj.userMapTime && ajaxObj.userId) {
        const startTime = ajaxObj.userMapTime.split('~')[0];
        const endTime = ajaxObj.userMapTime.split('~')[1];
        const userId = ajaxObj.userId;
        const sqlLease = `select leasestation,STATIONNAME,BAIDU_X,BAIDU_Y,SUM from baidu_xy a
                        join (
                            select count(*) as sum,LEASESTATION from b_leaseinfohis_brief201405
                        where cardno = ${userId}
                        and DATE_FORMAT(LEASETIME,'%Y %m %d %H %i %S') > DATE_FORMAT('${startTime}','%Y %m %d %H %i %S') 
                        and DATE_FORMAT(LEASETIME,'%Y %m %d %H %i %S') < DATE_FORMAT('${endTime}','%Y %m %d %H %i %S') 
                        group by LEASESTATION) b
                        on a.STATIONID = b.LEASESTATION order by SUM desc;`;
        const result  = {};
        // const sql = `select * from week_holi_201405 where CARDNO = ${userId}`;
        console.time('sqlLease');
        connection.query(sqlLease, function (error, results, fields) {
            if (error) throw error;
            result.lease = [];
            for (let i = 0; i < results.length; i++) {
                result.lease[i] = results[i];
            }
            console.timeEnd('sqlLease');
            
            const sqlReturn = `select returnstation,STATIONNAME,BAIDU_X,BAIDU_Y,SUM from baidu_xy a
                        join (
                            select count(*) as sum,RETURNSTATION from b_leaseinfohis_brief201405
                        where cardno = ${userId}
                        and DATE_FORMAT(LEASETIME,'%Y %m %d %H %i %S') > DATE_FORMAT('${startTime}','%Y %m %d %H %i %S') 
                        and DATE_FORMAT(LEASETIME,'%Y %m %d %H %i %S') < DATE_FORMAT('${endTime}','%Y %m %d %H %i %S') 
                        group by RETURNSTATION) b
                        on a.STATIONID = b.RETURNSTATION order by SUM desc;`;
            console.time('sqlReturn');
            connection.query(sqlReturn, function (error, results, fields) {
                if (error) throw error;
                result.return = [];
                for (let i = 0; i < results.length; i++) {
                    result.return[i] = results[i];
                }
            const res = JSON.stringify(result);
            response.write(JSON.stringify(result),'utf-8');
            console.timeEnd('sqlReturn');
            response.end();
            });
        });
    }
    /* 查询使用情况热力图 */
    if (ajaxObj.heatmapTime) {
        const startTime = ajaxObj.heatmapTime.split('~')[0];
        const endTime = ajaxObj.heatmapTime.split('~')[1];
        const userId = ajaxObj.userId;
        const usage = ajaxObj.usage;
        var sql;
        if (usage === '1') {
            sql = `select leasestation as stationId, count(*) as sum from b_leaseinfohis_brief201405
            where DATE_FORMAT(LEASETIME,'%Y %m %d %H %i %S') > DATE_FORMAT('${startTime}','%Y %m %d %H %i %S') 
            and DATE_FORMAT(LEASETIME,'%Y %m %d %H %i %S') < DATE_FORMAT('${endTime}','%Y %m %d %H %i %S') 
            ${userId ? `and cardno = ${userId}`: ''}
            group by stationId`;
        } else {
            sql =  `select returnstation as stationId, count(*) as sum from b_leaseinfohis_brief201405
            where DATE_FORMAT(RETURNTIME,'%Y %m %d %H %i %S') > DATE_FORMAT('${startTime}','%Y %m %d %H %i %S') 
            and DATE_FORMAT(RETURNTIME,'%Y %m %d %H %i %S') < DATE_FORMAT('${endTime}','%Y %m %d %H %i %S') 
            ${userId ? `and cardno = ${userId}`: ''}
            group by stationId`;
        }
        console.log(`heatMap: ${usage}, sql: ${sql}`);
        const result  = [];
        console.time('sql');
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            for (let i = 0; i < results.length; i++) {
                result[i] = results[i];
            }
            response.write(JSON.stringify(result,'utf-8'));
            console.timeEnd('sql')
            response.end();
        });
        
    }
    /* 轨迹查询 */
    if (ajaxObj.trackMapTime) {
        const startTime = ajaxObj.trackMapTime.split('~')[0];
        const endTime = ajaxObj.trackMapTime.split('~')[1];
        const userId = ajaxObj.userId;
        const sql = `select cardno,LEASESTATION,RETURNSTATION,count(*) as sum from b_leaseinfohis_brief201405
                        where cardno = ${userId}
                        and DATE_FORMAT(LEASETIME,'%Y %m %d %H %i %S') > DATE_FORMAT('${startTime}','%Y %m %d %H %i %S') 
                        and DATE_FORMAT(LEASETIME,'%Y %m %d %H %i %S') < DATE_FORMAT('${endTime}','%Y %m %d %H %i %S')
                        group by LEASESTATION,RETURNSTATION
                        ORDER BY sum DESC`;
        const result  = [];
        console.time('sql');
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            for (let i = 0; i < results.length; i++) {
                result[i] = results[i];
            }
            response.write(JSON.stringify(result,'utf-8'));
            console.timeEnd('sql')
            response.end();
        });
    }

}
http.createServer(onRequest).listen(8082);

console.log("Server has started.port on 8082\n");













