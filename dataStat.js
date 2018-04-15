var dateList = [
    ['2014-5-1',,'劳动节'],
    ['2014-5-2',,'劳动节'],
    ['2014-5-3',,'劳动节'],
    ['2014-5-4',],
    ['2014-5-5',],
    ['2014-5-6',],
    ['2014-5-7',],
    ['2014-5-8',],
    ['2014-5-9',],
    ['2014-5-10',],
    ['2014-5-11',],
    ['2014-5-12',],
    ['2014-5-13',],
    ['2014-5-14',],
    ['2014-5-15',],
    ['2014-5-16',],
    ['2014-5-17',],
    ['2014-5-18',],
    ['2014-5-19',],
    ['2014-5-20',],
    ['2014-5-21',],
    ['2014-5-22',],
    ['2014-5-23',],
    ['2014-5-24',],
    ['2014-5-25',],
    ['2014-5-26',],
    ['2014-5-27',],
    ['2014-5-28',],
    ['2014-5-29',],
    ['2014-5-30',],
    ['2014-5-31',,'端午节'],

];
var dataCount = [
    168097,
    167284,
    173151,
    81794,
    189777,
    184781,
    200541,
    180625,
    179730,
    153356,
    110111,
    184209,
    180159,
    183819,
    148406,
    186204,
    119488,
    154096,
    160759,
    190125,
    213832,
    207853,
    21,
    207558,
    175903,
    208449,
    167359,
    195931,
    201162,
    199414,
    187019,
];
for(var i=0;i<dateList.length;i++){
    dateList[i][1] = dataCount[i];
}

var heatmapData = [];
var lunarData = [];
for (var i = 0; i < dateList.length; i++) {
    heatmapData.push([
        dateList[i][0],
       dataCount[i]
    ]);
    lunarData.push([
        dateList[i][0],
        1,
        dateList[i][1],
        dateList[i][2]
    ]);
}


var statCalendar = echarts.init($('.calendar')[0]);

var optionCalendar = {
    tooltip: {
        formatter: function (params) {
            return '使用量: ' + params.value[1].toFixed(2);
        }
    },

    visualMap: {
        show: false,
        min: 100000,
        max: 220000,
        calculable: true,
        seriesIndex: [2],
        orient: 'horizontal',
        left: 'center',
        bottom: 20,
        inRange: {
            color: ['#e0ffff', 'red'],
            opacity: 0.5
        },
        controller: {
            inRange: {
                opacity: 0.5
            }
        }
    },

    calendar: [{
        left: 'center',
        top: 'middle',
        cellSize: [70, 70],
        yearLabel: {show: false},
        orient: 'vertical',
        dayLabel: {
            firstDay: 1,
            nameMap: 'cn'
        },
        monthLabel: {
            show: false
        },
        range: '2014-05'
    }],

    series: [{
        type: 'scatter',
        coordinateSystem: 'calendar',
        symbolSize: 1,
        label: {
            normal: {
                show: true,
                formatter: function (params) {
                    var d = echarts.number.parseDate(params.value[0]);
                    return d.getDate() + '\n\n' + params.value[2] + '\n\n';
                },
                textStyle: {
                    color: '#000'
                }
            }
        },
        data: lunarData
    }, {
        type: 'scatter',
        coordinateSystem: 'calendar',
        symbolSize: 1,
        label: {
            normal: {
                show: true,
                formatter: function (params) {
                    return '\n\n\n' + (params.value[3] || '');
                },
                textStyle: {
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#a00'
                }
            }
        },
        data: lunarData
    }, {
        name: '使用量',
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: heatmapData
    }]
};

statCalendar.setOption(optionCalendar);

var statHour = echarts.init($('.hour-chart')[0]);
var optionHour = {
    title: {
        text: '小时使用量统计',
        textStyle: {
            fontSize: 12
        }
    },
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data:['00',
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23']
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : ['00-01',
                '01-02',
                '02-03',
                '03-04',
                '04-05',
                '05-06',
                '06-07',
                '07-08',
                '08-09',
                '09-10',
                '10-11',
                '11-12',
                '12-13',
                '13-14',
                '14-15',
                '15-16',
                '16-17',
                '17-18',
                '18-19',
                '19-20',
                '20-21',
                '21-22',
                '22-23',
                '23-24']
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [

        {
            name:'使用量',
            type:'line',
            // stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            // areaStyle: {normal: {}},
            data:[
                486,
                245,
                482,
                332,
                728,
                6171,
                258723,
                544470,
                464644,
                343256,
                323286,
                324160,
                317458,
                316522,
                319078,
                375645,
                418378,
                473885,
                323826,
                233605,
                187455,
                20067,
                6039,
                1942],
        }
    ]
};
statHour.setOption(optionHour);


var statWeek = echarts.init($('.week-chart')[0]);
var optionWeek = {
    title: {
        text: '周使用量统计',
        textStyle: {
            fontSize: 12
        }
    },
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data:[
            '星期一',
            '星期二',
            '星期三',
            '星期四',
            '星期五',
            '星期六',
            '星期日',
            '节假日',
        ]
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : [
                '星期一',
                '星期二',
                '星期三',
                '星期四',
                '星期五',
                '星期六',
                '星期日',
                '节假日',
            ]
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [

        {
            name:'使用量',
            type:'line',
            // stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            // areaStyle: {normal: {}},
            data:[
                743185,
                722418,
                794116,
                738025,
                565351,
                480383,
                521898,
                695507,
                ],
        }
    ]
};
statWeek.setOption(optionWeek);

var statInfo = echarts.init($('.info-chart')[0]);
var optionInfo = {
    color: ['#3398DB'],
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : ['总记录数','>=0','<10','10-20','20-30','30-40','40-50','50-75','75-100','100-150','>=150'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'直接访问',
            type:'bar',
            barWidth: '60%',
            data:[5260883,435322,273482,78731,36635,19701,10856,10941,3069,1531,376]
        }
    ]
};
statInfo.setOption(optionInfo);