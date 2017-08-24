//地图功能
    var Map = {
        createMap:function(){
            map = new BMap.Map("citiBikeMap");    // 创建Map实例
            /*map是全局对象待解决*/
            map.centerAndZoom(new BMap.Point(-74.04424731,40.72759597), 15);  // 初始化地图,设置中心点坐标和地图级别
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
        clearOverlays:function(){
            map.clearOverlays();
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

        heatMap:function(){
            heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":30});
            map.addOverlay(heatmapOverlay);
            //heatmapOverlay.setDataSet({data:points,max:100});//是否显示热力图
        },

        openHeatMap:function(){
            heatmapOverlay.show();
        },
        closeHeatmap:function(){
            heatmapOverlay.hide();
        },
        setGradient:function(){
            /*格式如下所示:
           {
                 0:'rgb(102, 255, 0)',
                 .5:'rgb(255, 170, 0)',
                 1:'rgb(255, 0, 0)'
           }*/
            var gradient = {};
            var colors = document.querySelectorAll("input[type='color']");
            colors = [].slice.call(colors,0);
            colors.forEach(function(ele){
                gradient[ele.getAttribute("data-key")] = ele.value;
            });
            heatmapOverlay.setOptions({"gradient":gradient});
        },

        initMap:function(){
            this.createMap();
            this.heatMap();
        },
    };

    Map.initMap();
    var stations=[];
    $(document).ready(function(){
        $.ajax({
            type: 'GET',
            url: 'http://127.0.0.1:8081/',
            data: 'stations',
            dataType: 'json',
            error: function(){
                alert("Request failed.");
            },
            success: function(data){
                //alert("Request succeed.");
                //data = JSON.parse(data);
                stations = data;
            }
        });
        $.ajax({
            type: 'GET',
            url: 'http://127.0.0.1:8081/',
            data: 'heatInfo',
            dataType: 'json',
            error: function(){
                alert("Request failed.");
            },
            success: function(data){
                //alert("Request succeed.");
                //data = JSON.parse(data);
                //console.log(data);
                var heatPoints = [];

                for(var i = 0; i < data.length; i++) {
                    var heatPoint = {
                        lat : '',
                        lng : '',
                        count: '',
                    };
                    heatPoint.lat = data[i].start_station_latitude;
                    heatPoint.lng = data[i].start_station_longitude;
                    heatPoint.count = data[i].count;
                    heatPoints.push(heatPoint);
                }
                console.log(heatPoints);
                heatmapOverlay.setDataSet({data:heatPoints,max:1900});
                Map.closeHeatmap();

            }
        });
    });



    $("#stations").bind("click",function(){
        Map.addMarker(stations);
    });

    $("#stationsOff").bind("click",function(){
        var allOverlay = map.getOverlays();
        console.log(allOverlay);
        for (var i = 0; i < allOverlay.length -1; i++){
                map.removeOverlay(allOverlay[i]);
        }
    });

    /*$("#allCoverOff").bind("click",function(){
        Map.openHeatMap();
        Map.clearOverlays();
    });*/


    $("#heatInfo").bind("click",function(){
        Map.openHeatMap();
    });

    $("#heatInfoOff").bind("click",function(){
        Map.closeHeatmap();
    });