    layui.use('laydate', function(){
      var laydate = layui.laydate;      
      laydate.render({
          elem: '#heatmap-time' //指定元素
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
    var map = new BMap.Map("heat-map");          // 创建地图实例

    var point = new BMap.Point(120.19, 30.26);
    map.centerAndZoom(point, 13);             // 初始化地图，设置中心点坐标和地图级别
    map.enableScrollWheelZoom(); // 允许滚轮缩放

   
    if(!isSupportCanvas()){
    	alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
    }
	//详细的参数,可以查看heatmap.js的文档 https://github.com/pa7/heatmap.js/blob/master/README.md
	//参数说明如下:
	/* visible 热力图是否显示,默认为true
     * opacity 热力的透明度,1-100
     * radius 势力图的每个点的半径大小   
     * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
     *	{
			.2:'rgb(0, 255, 255)',
			.5:'rgb(0, 110, 255)',
			.8:'rgb(100, 0, 255)'
		}
		其中 key 表示插值的位置, 0~1. 
		    value 为颜色值. 
     */
    const heatMapParams = {
        draw: 'heatmap',
        size: 5, // 每个热力点半径大小
        gradient: { // 热力图渐变色
            0.1: "rgb(0,0,255)",
            0.5: "rgb(0,255,0)",
            0.8: "yellow",
            1.0: "rgb(255,0,0)"
        },
        // max: 100, // 最大权重值
    };
	heatmapOverlay = new BMapLib.HeatmapOverlay(heatMapParams);
    map.addOverlay(heatmapOverlay);
    
	// heatmapOverlay.setDataSet({data:points,max:100});
	//是否显示热力图
    function openHeatmap(){
        const heatMapTime = $('#heatmap-time').val();
        const heatMapType = $('#heatmap-type').val();
        const userId = $('#heatmap-id').val();
        console.log($('#heatmap-time').val());
        console.log($('#heatmap-type').val());
        console.log($('#heatmap-id').val());

        $.ajax({
            type: 'GET',
            url: 'http://127.0.0.1:8082/',
            data: {
                heatmapTime: heatMapTime,
                usage: heatMapType,
                userId:userId,
            },
            dataType: 'json',
            error: function () {
                alert("Request failed.");
            },
            success: function (data) {
                // console.log(data);
                const mixResult = [];
                let max = 0;
                for (let i=0;i<data.length;i++) {
                    for (let j=0;j<stations.length;j++) {
                        if(data[i].stationId === stations[j].stationId) {
                            // data[i].
                            // stations[j].sum = data[i].sum;
                            max = data[i].sum > max ? data[i].sum : max;
                            mixResult[i] = {
                                ...stations[j],
                                ...data[i],
                            };
                        }
                    }
                }
                console.log(mixResult);
                // console.log('max', max);
                // console.log('userId',userId ? 20: 5000);
                heatmapOverlay.setDataSet({
                    data: mixResult
                    .filter(item => {
                        return item.baiduX && item.baiduY && item.sum;
                    })
                    .map(item => ({
                        lng: item.baiduX,
                        lat: item.baiduY,
                        count: item.sum,
                    })),
                    max: max,
                });
            }
        });
        heatmapOverlay.show();
    }
	function closeHeatmap(){
        heatmapOverlay.setDataSet({
            data: [],
            max: 0,
        });
        heatmapOverlay.hide();
    }
	closeHeatmap();
    function setGradient(){
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
    }
	//判断浏览区是否支持canvas
    function isSupportCanvas(){
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }
