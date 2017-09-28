var Echarts = {
     myChart: echarts.init(document.getElementById('citiBikeEcharts')),
     option: {
        title: {
            text: '折线图'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: [0,1,2]
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: [0,1,2]
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '',
                type: 'line',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                areaStyle: {normal: {}},
                data: [0,1,2]
            }
        ],

        setLegend: function(legend){
            this.legend.data = legend;
        },
        pushLegend: function(legend){
            this.legend.data.concat(legend);
        },
        setXAxis: function(xAxix){
            this.xAxis.data = xAxix;
        },
        setSeries: function(i,data){
            this.series[i] =  data;
        },
        pushSeries: function(name,data){
            var object = {
                            name: name,
                            type: 'line',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            areaStyle: {normal: {}},
                            data: data
                        }
            this.series.push(object);
        }
    },
    setOption: function(option){
        this.myChart.setOption(option);
    }
};






$(document).ready(function () {
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
                data: [],
                date: []
            };
            for (var i = 0; i < data.length; i++) {

                manWorks.data.push(data[i].num);
                manWorks.date.push(data[i].date);
            }
            console.log(manWorks);
            $("#manWork").bind("click", function () {

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
                data: [],
                date: [],
                week: []
            };
            for (var i = 0; i < data.length; i++) {

                manRests.data.push(data[i].num);
                manRests.date.push(data[i].date);
                manRests.week.push(data[i].week);
            }
            console.log(manRests);
            $("#manRest").bind("click", function () {
                myChart.setOption(
                    option.series[0].data.push(manRests.data)
                );
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
                data: [],
                date: [],
                week: []
            };
            for (var i = 0; i < data.length; i++) {

                womanWorks.data.push(data[i].num);
                womanWorks.date.push(data[i].date);
                womanWorks.week.push(data[i].week);
            }
            console.log(womanWorks);
            $("#womanWork").bind("click", function () {
                myChart.setOption({
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data:womanWorks.date
                        }
                    ],
                    series: [
                        {
                            name: '',
                            type: 'line',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            areaStyle: {normal: {}},
                            data: womanWorks.data
                        }
                    ]
                });
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
                data: [],
                date: [],
                week: []
            };
            for (var i = 0; i < data.length; i++) {

                womanRests.data.push(data[i].num);
                womanRests.date.push(data[i].date);
                womanRests.week.push(data[i].week);
            }
            console.log(womanRests);
            $("#womanRest").bind("click", function () {
                myChart.setOption({
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: womanRests.date
                        }
                    ],
                    series: [
                        {
                            name: '',
                            type: 'line',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            areaStyle: {normal: {}},
                            data: womanRests.data
                        }
                    ]
                });
            });
        }
    });
});