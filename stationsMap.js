var map = new BMap.Map("stations-map", {
    enableMapClick: false
});    // 创建Map实例
map.centerAndZoom(new BMap.Point(120.19, 30.26), 14);  // 初始化地图,设置中心点坐标和地图级别
map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));// 左上角，添加比例尺
map.addControl(new BMap.NavigationControl());//左上角，添加默认缩放平移控件
map.setMapStyle({
    style: 'light'
});

var data = [];

var opts = {
    width : 250,     // 信息窗口宽度
    height: 40,     // 信息窗口高度
    // title : "信息窗口" , // 信息窗口标题
    enableMessage:true//设置允许信息窗发送短息
   };

for(var i=0;i<stations.length;i++){
    data.push({
       geometry:{
           type: 'Point',
           coordinates: [stations[i].baiduX,stations[i].baiduY]
       },
       stationName: stations[i].stationName,
       stationId: stations[i].stationId,
    });
}
var dataSet = new mapv.DataSet(data);

var options = {
    fillStyle: 'rgba(255, 50, 50, 1)', 
    globalAlpha: 1, // 透明度
    // shadowColor: 'rgba(255, 50, 50, 1)',
    // shadowBlur: 100,
    globalCompositeOperation: 'lighter',
    methods: {
        click: function (item) {
            // alert(`${item.stationId} ${item.name}`);
            openInfo(`${item.stationId} ${item.stationName}`, item);
        }
    },
    size: 3,
    draw: 'simple'
}

var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);


function openInfo(content,e){
    // var p = e.target;
    console.log(e);
    var point = new BMap.Point(e.geometry.coordinates[0], e.geometry.coordinates[1]);
    var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象 
    map.openInfoWindow(infoWindow,point); //开启信息窗口
}
// mapvLayer.show(); // 显示图层
// mapvLayer.hide(); // 删除图层
