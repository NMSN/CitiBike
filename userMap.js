layui.use('laydate', function(){
    var laydate = layui.laydate;      
    laydate.render({
        elem: '#user-map-time' //指定元素
        ,type: 'datetime'
        ,value: '2014-05-01 00:00:00 ~ 2014-05-31 23:59:59'
      //   ,format: 'yyyy/MM/dd HH:mm:ss - yyyy/MM/dd HH:mm:ss'
        ,isInitValue: false //是否允许填充初始值，默认为 true
        ,min: '2014-05-01 00:00:00'
        ,max: '2014-05-31 23:59:59'
        ,range: '~'
    });
  });
  layui.use('form', function(){
      var form = layui.form;
  });
const userMap = new BMap.Map("user-map", {
    enableMapClick: false
});    // 创建Map实例
userMap.centerAndZoom(new BMap.Point(120.19, 30.26), 13);  // 初始化地图,设置中心点坐标和地图级别
userMap.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
userMap.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));// 左上角，添加比例尺
userMap.addControl(new BMap.NavigationControl());//左上角，添加默认缩放平移控件
userMap.setMapStyle({
    style: 'light'
});

var userLeaseBar = $('.user-lease-bar')[0];
var userReturnBar = $('.user-return-bar')[0];

var EchartUserLease = new EchartsBar(userLeaseBar);
EchartUserLease.option.setTitle('借车站点TOP');

var EchartUserReturn = new EchartsBar(userReturnBar);
EchartUserReturn.option.setTitle('还车站点TOP');
EchartUserReturn.option.setColor('blue');

$('#user-search-button').on('click',function(){
    const userMapId = $('#user-map-id').val();
    const userMapTime = $('#user-map-time').val();
    if (userMapId === '') {
        alert('请输入用户编号');
        return false;
    }
    var stations = [];
    $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:8082/',
        data: {
            userId: userMapId,
            userMapTime: userMapTime, 
        },
        dataType: 'json',
        error: function () {
            alert("Request failed.");
        },
        success: function (data) {
            EchartUserLease.option.clearSeries();
                const barArrLease = [];
                for (let j=0;j<data.lease.length;j++){
                    stations.push({
                        geometry: {
                            type: 'Point',
                            coordinates: [data.lease[j].BAIDU_X,data.lease[j].BAIDU_Y]
                        },
                        size: data.lease[j].SUM*1,
                        fillStyle: 'rgba(255,0,0,0.3)',
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
                    if(j < 10) {
                        EchartUserLease.option.pushXAxis(data.lease[j].STATIONNAME);
                        console.log(data.lease[j].SUM*1, data.lease[j].STATIONNAME);
                        barArrLease.push(data.lease[j].SUM*1);
                    }

                }
                EchartUserLease.option.setSeries(barArrLease);

                EchartUserReturn.option.clearSeries();
                const barArrReturn = [];
                for (let j=0;j<data.return.length;j++){
                    stations.push({
                        geometry: {
                            type: 'Point',
                            coordinates: [data.return[j].BAIDU_X,data.return[j].BAIDU_Y]
                        },
                        size: data.return[j].SUM*1,
                        fillStyle: 'rgba(0,0,255,0.3)',
                        shadowColor: 'rgba(255, 50, 50, 1)',
                        // globalAlpha: 0.5, // 透明度
                        shadowBlur:30,
                        globalCompositeOperation: 'lighter',
                        methods: {
                            click: function (item) {
                                console.log(item);
                            }
                        },
                        draw: 'simple'
                    });
                    if(j < 10) {
                        EchartUserReturn.option.pushXAxis(data.return[j].STATIONNAME);
                        barArrReturn.push(data.return[j].SUM*1);
                    }
                }
                EchartUserReturn.option.setSeries(barArrReturn);
            // }
            var dataSet = new mapv.DataSet(stations);
            var mapvLayer = new mapv.baiduMapLayer(userMap, dataSet);
        },
    });
});