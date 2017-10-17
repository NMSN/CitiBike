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
            data: ['']
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
                data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [],

        setLegend: function(legend){
            this.legend.data = legend;
        },
        pushLegend: function(legend){
            this.legend.data.push(legend);
            Echarts.myChart.setOption(this);
        },
        setXAxis: function(xAxis){
            this.xAxis.data = xAxis;
        },
        pushSeries: function(name,data){
            var object = {
                            name: name,
                            type: 'line',

                            label: {
                                normal: {
                                    show: true,
                                    //position: 'top'
                                }
                            },
                            //areaStyle: {normal: {}},
                            data: data
                        };

            this.series.push(object);
            Echarts.myChart.setOption(this);
        },

        clearSeries:function(){
            this.series = []

        }

    },
    setOption: function(option){
        this.myChart.setOption(option);
    },


};
Echarts.setOption(Echarts.option);





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
                Echarts.option.pushLegend('manWorks');
                Echarts.option.pushSeries('manWorks',manWorks.data);

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
                date: []
            };
            for (var i = 0; i < data.length; i++) {

                manRests.data.push(data[i].num);
                manRests.date.push(data[i].date);

            }
            console.log(manRests);
            $("#manRest").bind("click", function () {
                Echarts.option.pushLegend('manRests');
                Echarts.option.pushSeries('manRests',manRests.data);
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
                date: []
            };
            for (var i = 0; i < data.length; i++) {

                womanWorks.data.push(data[i].num);
                womanWorks.date.push(data[i].date);

            }
            console.log(womanWorks);
            $("#womanWork").bind("click", function () {
                Echarts.option.pushLegend('womanWorks');
                Echarts.option.pushSeries('womanWorks',womanWorks.data);
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
                date: []
            };
            for (var i = 0; i < data.length; i++) {

                womanRests.data.push(data[i].num);
                womanRests.date.push(data[i].date);
            }
            console.log(womanRests);
            $("#womanRest").bind("click", function () {
                Echarts.option.pushLegend('womanRests');
                Echarts.option.pushSeries('womanRests',womanRests.data);
            });
        }
    });




    // $.ajax({//hangzhou
    //     type: 'GET',
    //     url: 'http://127.0.0.1:8082/',
    //     data: 'HangZhou',
    //     dataType: 'json',
    //     error: function () {
    //         alert("Request failed.");
    //     },
    //     success: function (data) {
    //         //alert("Request succeed.");
    //         //data = JSON.parse(data);
    //         // console.log(data);
    //     }
    // });
});