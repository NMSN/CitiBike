function EchartsLine(item) {
    this.myChart = echarts.init(item);
    var that = this;
    this.option = {
        title: {
            text: '折线图',
            left: 'left',
            top: 6
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            // formatter:'{a},{b},{c}'
        },
        backgroundColor: '#FFFFFF',
        legend: {
            data: ['']
        },
        color:[
            'rgba(255,0,0,1)',
            'rgba(0,255,0,1)',
            'rgba(0,0,255,1)',
            'rgba(125,125,0,1)',
            'rgba(125,0,125,1)',
            'rgba(0,125,125,1)'
        ],
        toolbox: {
            feature: {
                saveAsImage: {},
                restore: {},
                dataView: {},
                magicType:{
                    type: ['line', 'bar', 'stack', 'tiled']
                }
            },
            top: 8
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
                data: ['周一','周二','周三','周四','周五','周六','周日','节假日'],
                // data: ['6-7','7-8','8-9','9-10','10-11','11-12','12-13','13-14','14-15','15-16','16-17','17-18','18-19','19-20','20-21','21-22'],
            }
        ],
        yAxis: [
            {
                type: 'value',
                min: 'dataMin'
            }
        ],
        series: [],

        setLegend: function(legend){
            this.legend.data = legend;
        },
        pushLegend: function(legend){
            this.legend.data.push(legend);
            that.myChart.setOption(this);
        },
        setXAxis: function(xAxis){
            this.xAxis[0].data = xAxis;
            that.myChart.setOption(this,true);
        },
        pushSeries: function(name,data){
            var object = {
                name: name,
                type: 'line',

                label: {
                    normal: {
                        show: true
                    }
                },
                data: data
            };

            this.series.push(object);
            that.myChart.setOption(this);
        },
        pushLegendAndSeries: function(name,data){
            this.legend.data.push(name);
            var object = {
                name: name,
                type: 'line',
                label: {
                    normal: {
                        show: true
                    }
                },
                data: data
            };
            this.series.push(object);
            that.myChart.setOption(this);
        },
        clearSeries:function(){
            this.series = [];
            that.myChart.setOption(this,true);
        }

    };
    this.setOption = function(option){
        this.myChart.setOption(option);
    };

}

function EchartsPie(item) {
    this.myChart = echarts.init(item);
    var that = this;
    this.option = {
        title: {
            text: '折线图',
            left: 'left',
            top: 6,
            textStyle:{
                fontSize:12
            }
        },
        color:[
            'rgba(255,0,0,1)',
            'rgba(0,255,0,1)',
            'rgba(0,0,255,1)',
            'rgba(125,125,0,1)',
            'rgba(125,0,125,1)',
            'rgba(0,125,125,1)'
        ],
        // color:[
        //     '#c23531',
        //     '#2f4554',
        //     '#61a0a8',
        //     '#d48265',
        //     '#91c7ae',
        //     '#749f83',
        //     '#ca8622',
        //     '#bda29a',
        //     '#6e7074',
        //     '#546570',
        //     '#c4ccd3'
        // ],
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c}"
        },
        legend: {
            show:false,
            orient: 'vertical',
            x: 'left',
            data:[]
        },
        series: [
            {
                name:'占比',
                type:'pie',
                radius: ['0', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        //position: 'center'
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[

                ]
            }
        ],

        setLegend: function(legend){
            this.legend.data = legend;
        },
        pushLegend: function(legend){
            this.legend.data.push(legend);
            that.myChart.setOption(this);
        },
        setXAxis: function(xAxis){
            this.xAxis[0].data = xAxis;
            that.myChart.setOption(this,true);
        },
        pushSeries: function(name,data){
            var object = {
                name: name,
                value: data
            };
            this.series[0].data.push(object);
            that.myChart.setOption(this);
        },
        pushLegendAndSeries: function(name,data){
            this.legend.data.push(name);
            var object = {
                name: name,
                value: data
            };
            this.series[0].data.push(object);
            that.myChart.setOption(this);
        },
        clearSeries:function(){
            this.series = [];
            that.myChart.setOption(this,true);
        }

    };
    this.setOption = function(option){
        this.myChart.setOption(option);
    };

}

function EchartsRadar(item) {
    this.myChart = echarts.init(item);
    var that = this;
    this.option = {
        title: {
            text: '基础雷达图'
        },
        tooltip: {},
        legend: {
            data: []
        },
        radar: {
            // shape: 'circle',
            name: {
                textStyle: {
                    color: '#000',
                    // backgroundColor: '#999',
                    borderRadius: 3,
                    padding: [3, 5]
                },
                fontSize:10,
            },
            nameGap:0,
            radius: 50,
            startAngle:135,
            indicator: [

            ]
        },
        series: [{
            name: '使用量占比',
            type: 'radar',
            // areaStyle: {normal: {}},
            data: [

            ]
        }],
        setLegend: function (legend) {
            this.legend.data = legend;
        },
        pushLegend: function (legend) {
            this.legend.data.push(legend);
            that.myChart.setOption(this);
        },
        setXAxis: function (xAxis) {
            this.xAxis[0].data = xAxis;
            that.myChart.setOption(this, true);
        },
        pushRadar: function(name,data){
            this.radar.indicator.push({name:name,max:data});
            that.myChart.setOption(this);
        },
        pushSeries: function (name, data) {
            var object = {
                name: name,
                value: data
            };
            this.series[0].data.push(object);
            that.myChart.setOption(this);
        },
        pushLegendAndSeries: function (name, data) {
            this.legend.data.push(name);
            var object = {
                name: name,
                value: data
            };
            this.series[0].data.push(object);
            that.myChart.setOption(this);
        },
        clearSeries: function () {
            this.series = [];
            that.myChart.setOption(this, true);
        }
    };
    this.setOption = function(option){
        this.myChart.setOption(option);
    };
}


$(document).ready(function () {

    var map = new BMap.Map("map", {
        enableMapClick: false
    });    // 创建Map实例
    map.centerAndZoom(new BMap.Point(120.19, 30.26), 13);  // 初始化地图,设置中心点坐标和地图级别
// map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
    map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));// 左上角，添加比例尺
    map.addControl(new BMap.NavigationControl());//左上角，添加默认缩放平移控件
    map.setMapStyle({
        style: 'light'
    });


    var weekModel = $('#week-model')[0];
    var hourModel = $('#hour-model')[0];
    var EchartWeek = new EchartsLine(weekModel);
    var EchartHour = new EchartsLine(hourModel);

    $('.action').on('click',function(){
        EchartWeek.myChart.resize();
        var category = $('.category-table input').val();
        // console.log(category);
        var option = $('.category').val();
        var method = $('.method').val();
        // console.log(option);
        if(category.length == ''){
            alert('请输入K值');
        }else{
            $.ajax({
                type: 'GET',
                url: 'http://127.0.0.1:8082/',
                data: {
                    category: category,
                    option: option,
                    method: method,
                },
                dataType: 'json',
                error: function () {
                    alert("Request failed.");
                },
                success: function (data) {
                    console.log(data);
                    EchartWeek.option.clearSeries();
                    $('#week-model').show();
                    EchartWeek.option.title.text = '日历折线图';
                    for(var i=0;i<data.ave.length;i++){
                        EchartWeek.option.pushLegendAndSeries(`  第${i+1}类\n总数:${data.clusters[i].length}`,data.ave[i]);
                    }
                    EchartWeek.myChart.resize();

                    for(var i=0;i<data.ave.length+1;i++){
                        $('#week-list').append('<li></li>');
                    }
                    var nameList = ['周一','周二','周三','周四','周五','周六','周日','节假日'];
                    var pie = new EchartsPie($('#week-list li')[0]);
                    pie.option.title.text = `用户数量`;
                    for(var j=0;j<data.clusters.length;j++){
                        pie.option.pushLegendAndSeries(`第${j+1}类`,data.clusters[j].length);
                    }

                    for(var i=0;i<data.ave.length;i++){
                        var radar = new EchartsRadar($('#week-list li')[i+1]);
                        radar.option.title.text = `${i+1}`;
                        var max = Math.max.apply(null,data.ave[i]);
                        for(var j=0;j<data.ave[0].length;j++){
                            radar.option.pushRadar(nameList[j],0.3);
                        }
                        radar.option.pushSeries('',data.ave[i]);
                    }
                    $('#week-list').show();
                    pie.myChart.resize();
                    $('#week-list').css('display','flex');
                    radar.myChart.resize();


                    // var color = ['rgba(194,53,49,0.3)','rgba(47,69,84,0.3)', 'rgba(97,160,168,0.3)', 'rgba(212,130,101,0.3)', 'rgba(145,199,174,0.3)','rgba(116,159,131,0.3)', 'rgba(202,134,34,0.3)', 'rgba(189,162,154,0.3)', 'rgba(110,112,116,0.3)','rgba(84,101,112,0.3)', 'rgba(196,204,211,0.3)'];
                    var color = ['rgba(255,0,0,0.3)','rgba(0,255,0,0.3)','rgba(0,0,255,0.3)','rgba(125,125,0,0.3)','rgba(125,0,125,0.3)','rgba(0,125,125,0.3)'];
                    var stations = [];

                    $.ajax({
                        type: 'GET',
                        url: 'http://127.0.0.1:8082/',
                        data: {
                            idArr: 'idArr'
                        },
                        dataType: 'json',
                        error: function () {
                            alert("Request failed.");
                        },
                        success: function (data) {
                            // $('#map,#canvas').show();
                            console.log(data);
                            for(var i=0;i<data.length;i++){
                                var thiscolor = color.shift();
                                for (j=0;j<data[i].length;j++){
                                    stations.push({
                                        geometry: {
                                            type: 'Point',
                                            coordinates: [data[i][j].BAIDU_X,data[i][j].BAIDU_Y]
                                        },
                                        size: data[i][j].SUM*0.1,
                                        fillStyle: thiscolor,
                                        shadowColor: 'rgba(255, 50, 50, 1)',
                                        // globalAlpha: 0.5, // 透明度
                                        shadowBlur: 30,
                                        globalCompositeOperation: 'lighter',
                                        methods: {
                                            click: function (item) {
                                                console.log(item);
                                            }
                                        },
                                        draw: 'simple'
                                    });
                                }
                            }
                            var dataSet = new mapv.DataSet(stations);
                            var mapvLayer = new mapv.baiduMapLayer(map, dataSet);

                        }
                    });



                    // console.log($('#bar-chart').offset().top + $('#bar-chart').height());
                    $('html,body').animate({
                        scrollTop:$('#bar-chart').offset().top + $('#bar-chart').height() + 20
                    },300);
                    $('#hour-model').hide();
                    $('#hour-list').hide();
                }
            });
        }
    });

    $('.empty').on('click',function(){
        EchartWeek.option.clearSeries();
        EchartHour.option.clearSeries();
        $('#week-model').hide();
        $('#hour-model').hide();
        $('#week-list').hide();
        $('#hour-list').hide();
    });

    EchartWeek.myChart.on('click',function(params){
        $('#hour-model').show();
        console.log(params.seriesIndex);
        $.ajax({
            type: 'GET',
            url: 'http://127.0.0.1:8082/',
            data: {
                seriesIndex: params.seriesIndex
            },
            dataType: 'json',
            error: function () {
                alert("Request failed.");
            },
            success: function (data) {
                console.log(data);

                EchartHour.option.title.text = '小时折线图';
                EchartHour.option.setXAxis(['6-7','7-8','8-9','9-10','10-11','11-12','12-13','13-14','14-15','15-16','16-17','17-18','18-19','19-20','20-21','21-22']);
                EchartHour.option.clearSeries();
                for(var i=0;i<data.ave.length;i++){
                    // console.log(data.ave[i]);
                    EchartHour.option.pushLegendAndSeries(`  第${i+1}类\n总数:${data.clusters[i].length}`,data.ave[i]);
                }
                EchartHour.myChart.resize();


                for(var i=0;i<data.ave.length+1;i++){
                    $('#hour-list').append('<li></li>');
                }
                // var nameList = ['6-7','7-8','8-9','9-10','10-11','11-12','12-13','13-14','14-15','15-16','16-17','17-18','18-19','19-20','20-21','21-22'];
                // for(var i=0;i<data.ave.length;i++){
                //     var pie2 = new EchartsPie($('#hour-list li')[i]);
                //     pie2.option.title.text = `${i+1}`;
                //     for(var j=0;j<data.ave[0].length;j++){
                //         pie2.option.pushLegendAndSeries(nameList[j],data.ave[i][j]);
                //         console.log(data.ave[i][j]);
                //     }
                // }

                var nameList = ['6-7','7-8','8-9','9-10','10-11','11-12','12-13','13-14','14-15','15-16','16-17','17-18','18-19','19-20','20-21','21-22'];
                var pie2 = new EchartsPie($('#hour-list li')[0]);
                pie2.option.title.text = `用户数量`;

                for(var j=0;j<data.clusters.length;j++){
                    pie2.option.pushLegendAndSeries(`第${j+1}类`,data.clusters[j].length);
                }

                for(var i=0;i<data.ave.length;i++){
                    var radar = new EchartsRadar($('#hour-list li')[i+1]);
                    radar.option.title.text = `${i+1}`;
                    radar.option.radar.startAngle = 315;
                    var max = Math.max.apply(null,data.ave[i]);
                    for(var j=0;j<data.ave[0].length;j++){
                        radar.option.pushRadar(nameList[j],0.2);
                    }
                    radar.option.pushSeries('',data.ave[i]);
                }
                $('#hour-list').show();
                $('#hour-list').css('display','flex');
                radar.myChart.resize();


                console.log($('#week-model').offset().top +$('#week-model').height());
                $('html,body').animate({
                    scrollTop:$('#week-model').offset().top +$('#week-model').height() + 20
                },300);

            }
        });
    })
})