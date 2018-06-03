
$(document).ready(function () {
    var map = new BMap.Map("map", {
        enableMapClick: false
    });    // 创建Map实例
    map.centerAndZoom(new BMap.Point(120.19, 30.26), 13);  // 初始化地图,设置中心点坐标和地图级别
    map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
    map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));// 左上角，添加比例尺
    map.addControl(new BMap.NavigationControl());//左上角，添加默认缩放平移控件
    map.setMapStyle({
        style: 'light'
    });
    var weekModel = $('#week-model')[0];
    var hourModel = $('#hour-model')[0];
    var EchartWeek = new EchartsLine(weekModel);
    var EchartHour = new EchartsLine(hourModel);
    var mapvLayer;
    $('.cluster-confirm').on('click',function(){
        EchartWeek.myChart.resize();
        var category = $('.category-table input').val();
        var option = $('.category').val();
        var method = $('.method').val();
        const usage = $('.cluster-usage').val();
        console.log(category, option, method, usage);
        if(category === ''){
            alert('请输入K值');
        }else{
            $.ajax({
                type: 'GET',
                url: 'http://127.0.0.1:8082/',
                data: {
                    category: category,
                    option: option,
                    method: method,
                    usage: usage,
                },
                dataType: 'json',
                error: function () {
                    alert("Request failed.");
                },
                success: function (data) {
                    console.log(data);
                    const instance = data.clusters.map(item => {
                        return item.slice(0, 3);
                    })
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

                    layui.use('table', function(){
                        var table = layui.table;
                        
                        table.render({
                          elem: '#week-table',
                          cols: [[ //标题栏
                            {field: 'id', title: 'ID', width: 150, sort: true},
                            {field: 'x1', title: 'x1', width: 80},
                            {field: 'x2', title: 'x2', width: 80},
                            {field: 'x3', title: 'x3', width: 80},
                            {field: 'x4', title: 'x4', width: 80},
                            {field: 'x5', title: 'x5', width: 80},
                            {field: 'x6', title: 'x6', width: 80},
                            {field: 'x7', title: 'x7', width: 80},
                            {field: 'xholi', title: 'xholi', width: 80},
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
                    $('#week-list').empty();
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

                    const color = ['rgba(255,0,0,0.3)','rgba(0,255,0,0.3)','rgba(85,85,255,0.3)','rgba(125,125,0,0.3)','rgba(125,0,125,0.3)','rgba(0,125,125,0.3)'];
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
                            if (mapvLayer) {
                                mapvLayer.destroy();
                            }
                            const dataSet = new mapv.DataSet(stations);
                            mapvLayer = new mapv.baiduMapLayer(map, dataSet);
                        }
                    });
                    $('#hour-model').hide();
                    $('#hour-list').hide();
                }
            });
        }
    });

    $('.cluster-empty').on('click',function(){
        EchartWeek.option.clearSeries();
        EchartHour.option.clearSeries();
        $('#week-model').hide();
        $('#hour-model').hide();
        $('#week-list').hide();
        $('#hour-list').hide();
    });


    EchartWeek.myChart.on('click',function(params){
        $('#hour-model').show();
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
                const instance = data.clusters.map(item => {
                    return item.slice(0, 3);
                })
                const listArr = [];
                for(let i = 0; i < instance.length; i++) {
                    listArr.push({
                        id: `第${i+1}类`,
                        h6: "-",
                        h7: "-",
                        h8: "-",
                        h9: "-",
                        h10: "-",
                        h11: "-",
                        h12: "-",
                        h13: "-",
                        h14: "-",
                        h15: "-",
                        h16: "-",
                        h17: "-",
                        h18: "-",
                        h19: "-",
                        h20: "-",
                        h21: "-",
                        xholi: "-",
                    });
                    for(let j = 0; j < instance[i].length; j++) {
                        listArr.push({
                            id: instance[i][j].cardno,
                            h6: instance[i][j].arr[0],
                            h7: instance[i][j].arr[1],
                            h8: instance[i][j].arr[2],
                            h9: instance[i][j].arr[3],
                            h10: instance[i][j].arr[4],
                            h11: instance[i][j].arr[5],
                            h12: instance[i][j].arr[6],
                            h13: instance[i][j].arr[7],
                            h14: instance[i][j].arr[8],
                            h15: instance[i][j].arr[9],
                            h16: instance[i][j].arr[10],
                            h17: instance[i][j].arr[11],
                            h18: instance[i][j].arr[12],
                            h19: instance[i][j].arr[13],
                            h20: instance[i][j].arr[14],
                            h21: instance[i][j].arr[15],
                            });
                    }
                }
                const color = ['rgba(255,0,0,0.3)','rgba(0,255,0,0.3)','rgba(85,85,255,0.3)','rgba(125,125,0,0.3)','rgba(125,0,125,0.3)','rgba(0,125,125,0.3)'];
                const stations = [];
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
                        if (mapvLayer) {
                            mapvLayer.destroy();
                        }
                        const dataSet = new mapv.DataSet(stations);
                        mapvLayer = new mapv.baiduMapLayer(map, dataSet);
                    }
                });

                layui.use('table', function(){
                    var table = layui.table;
                    
                    table.render({
                      elem: '#hour-table',
                      cols: [[ //标题栏
                        {field: 'id', title: 'ID', width: 150, sort: true},
                        {field: 'h6', title: 'h6', width: 80},
                        {field: 'h7', title: 'h7', width: 80},
                        {field: 'h8', title: 'h8', width: 80},
                        {field: 'h9', title: 'h9', width: 80},
                        {field: 'h10', title: 'h10', width: 80},
                        {field: 'h11', title: 'h11', width: 80},
                        {field: 'h12', title: 'h12', width: 80},
                        {field: 'h13', title: 'h13', width: 80},
                        {field: 'h14', title: 'h14', width: 80},
                        {field: 'h15', title: 'h15', width: 80},
                        {field: 'h16', title: 'h16', width: 80},
                        {field: 'h17', title: 'h17', width: 80},
                        {field: 'h18', title: 'h18', width: 80},
                        {field: 'h19', title: 'h19', width: 80},
                        {field: 'h20', title: 'h20', width: 80},
                        {field: 'h21', title: 'h21', width: 80},
                      ]] 
                      ,data: listArr
                      //,skin: 'line' //表格风格
                      ,even: true
                      //,page: true //是否显示分页
                      //,limits: [5, 7, 10]
                      ,limit: (instance.length+1)*3 //每页默认显示的数量
                    });
                  });

                EchartHour.option.title.text = '小时折线图';
                EchartHour.option.setXAxis(['6-7','7-8','8-9','9-10','10-11','11-12','12-13','13-14','14-15','15-16','16-17','17-18','18-19','19-20','20-21','21-22']);
                EchartHour.option.clearSeries();
                for(var i=0;i<data.ave.length;i++){
                    EchartHour.option.pushLegendAndSeries(`  第${i+1}类\n总数:${data.clusters[i].length}`,data.ave[i]);
                }
                EchartHour.myChart.resize();
                $('#hour-list').empty();
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
                // console.log($('#week-model').offset().top +$('#week-model').height());
                // $('html,body').animate({
                //     scrollTop:$('#week-model').offset().top +$('#week-model').height() + 20
                // },300);
            }
        });
    })
})