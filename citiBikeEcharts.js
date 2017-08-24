


var Echarts= {
    initLineChart:function(id,title,data) {
        var myChart = echarts.init(document.getElementById(id));
        var option = {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            title: {
                left: 'center',
                text: title,
            },
           /* toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },*/
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data.date,
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 10
            }, {
                start: 0,
                end: 10,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],
            series: [
                {
                    name:'模拟数据',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        normal: {
                            color: 'rgb(255, 70, 131)'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgb(255, 158, 68)'
                            }, {
                                offset: 1,
                                color: 'rgb(255, 70, 131)'
                            }])
                        }
                    },
                    data: data.data
                }
            ]
        };

        myChart.setOption(option);

    }
};
    //Echarts.initLineChart();

$(document).ready(function() {
    $.ajax({//男性工作日
        type: 'GET',
        url: 'http://127.0.0.1:8081/',
        data: 'manWork',
        dataType: 'json',
        error: function () {
            alert("Request failed.");
        },
        success: function (data) {
            //alert("Request succeed.");
            //data = JSON.parse(data);
             var manWorks = {
                data:[],
                date:[],
                week:[]
             };
            for (var i = 0; i < data.length; i++) {

                manWorks.data.push(data[i].num);
                manWorks.date.push(data[i].date);
                manWorks.week.push(data[i].week);
            }
            console.log(manWorks);
            $("#manWork").bind("click",function(){
                Echarts.initLineChart("citiBikeEchartsManWork","manworks",manWorks);
            });
        }
    });

    $.ajax({//男性周末
        type: 'GET',
        url: 'http://127.0.0.1:8081/',
        data: 'manRest',
        dataType: 'json',
        error: function () {
            alert("Request failed.");
        },
        success: function (data) {
            //alert("Request succeed.");
            //data = JSON.parse(data);
            var manRests = {
                data:[],
                date:[],
                week:[]
            };
            for (var i = 0; i < data.length; i++) {

                manRests.data.push(data[i].num);
                manRests.date.push(data[i].date);
                manRests.week.push(data[i].week);
            }
            console.log(manRests);
            $("#manRest").bind("click",function(){
                Echarts.initLineChart("citiBikeEchartsManRest","manrests",manRests);
            });
        }
    });
    $.ajax({//女性工作日
        type: 'GET',
        url: 'http://127.0.0.1:8081/',
        data: 'womanWork',
        dataType: 'json',
        error: function () {
            alert("Request failed.");
        },
        success: function (data) {
            //alert("Request succeed.");
            //data = JSON.parse(data);
            var womanWorks = {
                data:[],
                date:[],
                week:[]
            };
            for (var i = 0; i < data.length; i++) {

                womanWorks.data.push(data[i].num);
                womanWorks.date.push(data[i].date);
                womanWorks.week.push(data[i].week);
            }
            console.log(womanWorks);
            $("#womanWork").bind("click",function(){
                Echarts.initLineChart("citiBikeEchartsWomanWork","womanwork",womanWorks);
            });
        }
    });
    $.ajax({//女性周末
        type: 'GET',
        url: 'http://127.0.0.1:8081/',
        data: 'womanRest',
        dataType: 'json',
        error: function () {
            alert("Request failed.");
        },
        success: function (data) {
            //alert("Request succeed.");
            //data = JSON.parse(data);
            var womanRests = {
                data:[],
                date:[],
                week:[]
            };
            for (var i = 0; i < data.length; i++) {

                womanRests.data.push(data[i].num);
                womanRests.date.push(data[i].date);
                womanRests.week.push(data[i].week);
            }
            console.log(womanRests);
            $("#womanRest").bind("click",function(){
                Echarts.initLineChart("citiBikeEchartsWomanRest","womanrests",womanRests);
            });
        }
    });
});