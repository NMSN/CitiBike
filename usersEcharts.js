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
                data: [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]
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
        pushLegendAndSeries: function(name,data){
            this.legend.data.push(name);
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
            this.series = [];
        },

    },
    setOption: function(option){
        this.myChart.setOption(option);
    },


};
Echarts.setOption(Echarts.option);

$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:8082/',
        data: 'HangZhou',
        dataType: 'json',
        error: function () {
            alert("Request failed.");
        },
        success: function (data) {
            var arr = [];
            for (var i = 0; i < data.length; i++) {
                arr[i] = {};
                arr[i].arr = [];
                for (var x in data[i]) {
                    if (x != 'CARDNO') {
                        // console.log(data[x]);
                        arr[i].arr.push(data[i][x]);
                    } else {
                        arr[i].cardno = data[i][x];
                    }
                }
            }
            console.log(arr);
            var result = kmeansGroup(5,arr);
            console.log(result);
            for(var i=0;i<result.length;i++){
                Echarts.option.pushLegendAndSeries(`第${i+1}类`,result[i].ave);
            }
        }
    });
});