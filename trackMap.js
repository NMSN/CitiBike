layui.use('laydate', function(){
  var laydate = layui.laydate;      
  laydate.render({
      elem: '#track-map-time' //指定元素
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
	// 百度地图API功能
	var trackMap = new BMap.Map("track-map");
	trackMap.centerAndZoom(new BMap.Point(120.19, 30.26), 13);
  trackMap.enableScrollWheelZoom();
  
$('#track-search-button').on('click',function() {
    const trackMapTime = $('#track-map-time').val();
    const userId = $('#track-map-id').val();
    console.log(trackMapTime);
    console.log(userId);
    $.ajax({
      type: 'GET',
      url: 'http://127.0.0.1:8082/',
      data: {
          trackMapTime: trackMapTime,
          userId:userId,
      },
      dataType: 'json',
      error: function () {
          alert("Request failed.");
      },
      success: function (data) {
        console.log(data);
        const curveArr =[];
        const leaseStations = [];
        const returnStations =[];
        for (let i=0;i<data.length;i++) {
          const curveObj = {};
          for (let j=0;j<stations.length;j++) {
            if(data[i].LEASESTATION === stations[j].stationId) {
              curveObj.lease = {
                stationId:  stations[j].stationId,
                stationName: stations[j].stationName,
                baiduX: stations[j].baiduX,
                baiduY: stations[j].baiduY,
              };
              leaseStations.push({
                geometry: {
                    type: 'Point',
                    coordinates: [stations[j].baiduX,stations[j].baiduY]
                },
                size: 5,
                fillStyle: 'rgba(255,0,0,0.4)',
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
            if(data[i].RETURNSTATION === stations[j].stationId) {
              curveObj.return = {
                stationId:  stations[j].stationId,
                stationName: stations[j].stationName,
                baiduX: stations[j].baiduX,
                baiduY:stations[j].baiduY,
              };
              returnStations.push({
                geometry: {
                    type: 'Point',
                    coordinates: [stations[j].baiduX,stations[j].baiduY]
                },
                size: 5,
                fillStyle: 'rgba(0,255,0,0.4)',
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
          curveObj.sum = data[i].sum;
          curveArr.push(curveObj);
          if (curveObj.lease && curveObj.return) {
            const startPosition = new BMap.Point(curveObj.lease.baiduX, curveObj.lease.baiduY),
            endPosition = new BMap.Point(curveObj.return.baiduX, curveObj.return.baiduY);
            const points = [startPosition, endPosition];
            const curve = new BMapLib.CurveLine(points, {strokeColor:"rgba(0,0,255,0.8)", strokeWeight:curveObj.sum, strokeOpacity:0.5}); //创建弧线对象
            trackMap.addOverlay(curve); //添加到地图中
          } else {
            console.log(curveObj);
          }
        }
        console.log(curveArr);
        var dataSet = new mapv.DataSet([...leaseStations,...returnStations]);
        var mapvLayer = new mapv.baiduMapLayer(trackMap, dataSet);
      }
  });
});

