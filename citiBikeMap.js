//地图功能
    var Map = {
        createMap:function(){
            map = new BMap.Map("citiBikeMap");    // 创建Map实例
            /*map是全局对象待解决*/
            map.centerAndZoom(new BMap.Point(-73.866552,40.845546), 15);  // 初始化地图,设置中心点坐标和地图级别
            map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
            map.setCurrentCity("纽约");          // 设置地图显示的城市 此项是必须设置的
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));//开启比例尺功能
            map.addControl(new BMap.NavigationControl());//开启缩放控件功能
             opts = {
                width: 350,     // 信息窗口宽度
                height: 70,     // 信息窗口
                enableMessage: true//设置允许信息窗发送短息
            };
        },

        addMarker:function(data){
            var points = [];  // 添加海量点数据
            for (var i = 0; i < data.length; i++) {
                var marker = new BMap.Marker(new BMap.Point(data[i].longitude, data[i].latitude));
                var content = "Station Name:" + data[i].station_name + "<br>" +
                    "Station Lng&Lat:" + data[i].longitude + "," + data[i].latitude;
                map.addOverlay(marker);               // 将标注添加到地图中
                this.addClickHandler(content,marker);
            }
        },

        addClickHandler:function(content,marker){
            marker.addEventListener("click",function(e){
                Map.openInfo(content,e);
            });
        },

        openInfo:function(content,e){
            var p = e.target;
            var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
            var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
            map.openInfoWindow(infoWindow,point); //开启信息窗口
        },

        initMap:function(){
            this.createMap();

        }
    };
    Map.initMap();

    $(".button").bind("click",function(){
        $.ajax({
            type: 'GET',
            url: 'http://127.0.0.1:8081/',
            data: 'stations',
            success: function(data){
                alert("Request succeed.");
                Map.addMarker(data);
            },
            error: function(){
                alert("Request failed.");
            },
            dataType: 'json',
        });
    });



