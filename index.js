
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
                    // console.log(data.clusters);
                    const instance = data.clusters.map(item => {
                        return item.slice(0, 3);
                    })
                    console.log(instance);
                    const listArr = [];
                    for(let i = 0; i < instance.length; i++) {
                        listArr.push({
                            id: `第${i+1}类`,
                            x1: "-",
                            x2: "-",
                            x3: "-",
                            x4: "-",
                            x5: "-",
                            x6: "-",
                            x7: "-",
                            xholi: "-",
                        });
                        for(let j = 0; j < instance[i].length; j++) {
                            listArr.push({
                                id: instance[i][j].cardno,
                                x1: instance[i][j].arr[0],
                                x2: instance[i][j].arr[1],
                                x3: instance[i][j].arr[2],
                                x4: instance[i][j].arr[3],
                                x5: instance[i][j].arr[4],
                                x6: instance[i][j].arr[5],
                                x7: instance[i][j].arr[6],
                                xholi: instance[i][j].arr[7],
                            });
                        }
                    }
                    console.log(listArr);

                    layui.use('table', function(){
                        var table = layui.table;
                        
                        table.render({
                          elem: '#week-table',
                          cols: [[ //标题栏
                            {field: 'id', title: 'ID', width: 150, sort: true},
                            {field: 'x1', title: 'w1', width: 80},
                            {field: 'x2', title: 'w2', width: 80},
                            {field: 'x3', title: 'w3', width: 80},
                            {field: 'x4', title: 'w4', width: 80},
                            {field: 'x5', title: 'w5', width: 80},
                            {field: 'x6', title: 'w6', width: 80},
                            {field: 'x7', title: 'w7', width: 80},
                            {field: 'xholi', title: 'wholi', width: 80},
                          ]]
                          ,data: listArr
                          //,skin: 'line' //表格风格
                          ,even: true
                          //,page: true //是否显示分页
                          //,limits: [5, 7, 10]
                          ,limit: (instance.length+1)*3 //每页默认显示的数量
                        });
                      });

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
                            console.log(stations);
                            var dataSet = new mapv.DataSet(stations);
                            var mapvLayer = new mapv.baiduMapLayer(map, dataSet);
                        }
                    });
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