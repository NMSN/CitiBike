


var Echarts= {
    initLineChart:function(data) {
        var myChart = echarts.init(document.getElementById('citiBikeEcharts'));
        var option = {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            title: {
                left: 'center',
                text: '大数据量面积图',
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
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
        $("#manWork").bind("click",function(){

        });
    }
};
    //Echarts.initLineChart();

$(document).ready(function() {
    $.ajax({
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
            Echarts.initLineChart(manWorks);


        }
    });
});