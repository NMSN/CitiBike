$(document).ready(function () {
    var myChart = echarts.init($('.bar-chart')[0]);
    var option = {
        title: {
            // text: '用户使用量分布图',
            left: '41%',
            top: 3
        },
        color: ['#3398DB'],
        backgroundColor: '#FFFFFF',
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '8%',
            right: '5%',
            bottom: '15%',
            top: '5%',
            containLabel: false
        },
        xAxis : [
            {
                type : 'value',
                show : true,
                // nameRotate : 90
            }
        ],
        yAxis : [
            {
                type : 'category',
                data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisTick: {
                    alignWithLabel: true
                },
                show: false
            }

        ],
        series : [
            {
                name:'用户数量',
                type:'bar',
                barWidth: '60%',
                data:[10, 52, 200, 334, 390, 330, 220]
            }
        ]
    };

    $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:8082/',
        data: {
            init: 'init'
        },
        dataType: 'json',
        error: function () {
            alert("Request failed.");
        },
        success: function (data) {
            $('.data-count .all').text(data.countAllInfo);
            $('.data-count .user').text(data.countAllUsers);
            $('.data-count .days').text(data.countDays);

            var arrX = [];
            var arrY = [];


            for(var key in data){
                arrX.push(key);
                arrY.push(data[key]);
            }
            option.yAxis[0].data = ['0-10','10-20','20-30','30-40','40-50','50-75','75-100','100-150','150-200','200+'];
            option.series[0].data = arrY;
            myChart.setOption(option);
        }
    });
    myChart.setOption(option);
})

