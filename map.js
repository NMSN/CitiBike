var map = new BMap.Map("stations-map", {
    enableMapClick: false
});    // 创建Map实例
map.centerAndZoom(new BMap.Point(120.19, 30.26), 14);  // 初始化地图,设置中心点坐标和地图级别
// map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));// 左上角，添加比例尺
map.addControl(new BMap.NavigationControl());//左上角，添加默认缩放平移控件
map.setMapStyle({
    style: 'light'
});

var data = [];

for(var i=0;i<stations.length;i++){
    data.push({
       geometry:{
           type: 'Point',
           coordinates: [stations[i].point.lng,stations[i].point.lat]
       }
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
            console.log(item);
        }
    },
    size: 3,
    draw: 'simple'
}

var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);

// mapvLayer.show(); // 显示图层
// mapvLayer.hide(); // 删除图层
