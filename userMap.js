const userMap = new BMap.Map("user-map", {
    enableMapClick: false
});    // 创建Map实例
userMap.centerAndZoom(new BMap.Point(120.19, 30.26), 13);  // 初始化地图,设置中心点坐标和地图级别
// map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
userMap.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));// 左上角，添加比例尺
userMap.addControl(new BMap.NavigationControl());//左上角，添加默认缩放平移控件
userMap.setMapStyle({
    style: 'light'
});

var userLeaseBar = $('.user-lease-bar')[0];
var userReturnBar = $('.user-return-bar')[0];

var EchartUserLease = new EchartsBar(userLeaseBar);
var EchartUserReturn = new EchartsBar(userReturnBar);

$('.user-search-button').on('click',function(){
    const inputValue = $('.user-search-input').val();
    // console.log(inputValue);
    var color = ['rgba(255,0,0,0.3)','rgba(0,255,0,0.3)','rgba(0,0,255,0.3)','rgba(125,125,0,0.3)','rgba(125,0,125,0.3)','rgba(0,125,125,0.3)'];
    var stations = [];
    $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:8082/',
        data: {
            usrIndex: inputValue,
        },
        dataType: 'json',
        error: function () {
            alert("Request failed.");
        },
        success: function (data) {
            console.log(data);
            console.log(EchartUserLease.option);
            EchartUserLease.option.clearSeries();
            // for(var i=0;i<data.length;i++){
                // var thiscolor = color.shift();
                let leaseColor = color.shift();
                const barArrLease = [];
                // EchartUserLease.option.title = "借车站点图";
                for (let j=0;j<data.lease.length;j++){
                    stations.push({
                        geometry: {
                            type: 'Point',
                            coordinates: [data.lease[j].BAIDU_X,data.lease[j].BAIDU_Y]
                        },
                        size: data.lease[j].SUM*1,
                        fillStyle: leaseColor,
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
                // console.log(barArr);
                EchartUserLease.option.setSeries(barArrLease);
                let returnColor = color.shift();
                console.log(leaseColor,returnColor);
                EchartUserReturn.option.clearSeries();
                const barArrReturn = [];
                for (let j=0;j<data.return.length;j++){
                    stations.push({
                        geometry: {
                            type: 'Point',
                            coordinates: [data.return[j].BAIDU_X,data.return[j].BAIDU_Y]
                        },
                        size: data.return[j].SUM*1,
                        fillStyle: returnColor,
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
                        console.log(data.return[j].SUM*1, data.return[j].STATIONNAME);
                        
                        barArrReturn.push(data.return[j].SUM*1);
                    }
                }
                console.log(stations);
                
                EchartUserReturn.option.setSeries(barArrReturn);
            // }
            var dataSet = new mapv.DataSet(stations);
            var mapvLayer = new mapv.baiduMapLayer(userMap, dataSet);
        },
    });
});