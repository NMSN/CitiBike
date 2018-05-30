function EchartsLine(item) {
  this.myChart = echarts.init(item);
  var that = this;
  this.option = {
      title: {
          text: '折线图',
          left: 'left',
          top: 6
      },
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'cross',
              label: {
                  backgroundColor: '#6a7985'
              }
          },
          // formatter:'{a},{b},{c}'
      },
      backgroundColor: '#FFFFFF',
      legend: {
          data: ['']
      },
      color:[
          'rgba(255,0,0,1)',
          'rgba(0,255,0,1)',
          'rgba(0,0,255,1)',
          'rgba(125,125,0,1)',
          'rgba(125,0,125,1)',
          'rgba(0,125,125,1)'
      ],
      toolbox: {
          feature: {
              saveAsImage: {},
              restore: {},
              dataView: {},
              magicType:{
                  type: ['line', 'bar', 'stack', 'tiled']
              }
          },
          top: 8
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis: [
          {
              type: 'category',
              boundaryGap: false,
              data: ['周一','周二','周三','周四','周五','周六','周日','节假日'],
              // data: ['6-7','7-8','8-9','9-10','10-11','11-12','12-13','13-14','14-15','15-16','16-17','17-18','18-19','19-20','20-21','21-22'],
          }
      ],
      yAxis: [
          {
              type: 'value',
              min: 'dataMin'
          }
      ],
      series: [],

      setLegend: function(legend){
          this.legend.data = legend;
      },
      pushLegend: function(legend){
          this.legend.data.push(legend);
          that.myChart.setOption(this);
      },
      setXAxis: function(xAxis){
          this.xAxis[0].data = xAxis;
          that.myChart.setOption(this,true);
      },
      pushSeries: function(name,data){
          var object = {
              name: name,
              type: 'line',

              label: {
                  normal: {
                      show: true
                  }
              },
              data: data
          };

          this.series.push(object);
          that.myChart.setOption(this);
      },
      pushLegendAndSeries: function(name,data){
          this.legend.data.push(name);
          var object = {
              name: name,
              type: 'line',
              label: {
                  normal: {
                      show: true
                  }
              },
              data: data
          };
          this.series.push(object);
          that.myChart.setOption(this);
      },
      clearSeries:function(){
          this.series = [];
          that.myChart.setOption(this,true);
      }

  };
  this.setOption = function(option){
      this.myChart.setOption(option);
  };

}

function EchartsBar(item) {
  this.myChart = echarts.init(item);
  var that = this;
  this.option = {
      title: {
          text: '柱状图',
          left: 'left',
          top: 6
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'cross',
              label: {
                  backgroundColor: '#6a7985'
              }
          },
          // formatter:'{a},{b},{c}'
      },
      backgroundColor: '#FFFFFF',
      legend: {
          data: ['']
      },
      color:[
          'rgba(255,0,0,1)',
          'rgba(0,255,0,1)',
          'rgba(0,0,255,1)',
          'rgba(125,125,0,1)',
          'rgba(125,0,125,1)',
          'rgba(0,125,125,1)'
      ],
      toolbox: {
          feature: {
              saveAsImage: {},
              restore: {},
              dataView: {},
              magicType:{
                  type: ['line', 'bar', 'stack', 'tiled']
              }
          },
          top: 8
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis: [
          {
              type: 'category',
              // boundaryGap: false,
              data: [],
          }
      ],
      yAxis: [
          {
              type: 'value',
              // min: 'dataMin'
          }
      ],
      series: [],

      setLegend: function(legend){
          this.legend.data = legend;
      },
      pushLegend: function(legend){
          this.legend.data.push(legend);
          that.myChart.setOption(this);
      },
      setXAxis: function(xAxis){
          this.xAxis[0].data = xAxis;
          that.myChart.setOption(this,true);
      },
      setSeries: function(data){
          this.series[0] = {
              barWidth: '60%',
              type: 'bar',
              data: data,
          };
          that.myChart.setOption(this);
      },
      pushXAxis: function(xAxis){
          this.xAxis[0].data.push(xAxis);
          that.myChart.setOption(this);
      },
      pushSeries: function(data, name = undefined){
          var object = {
              name: name,
              type: 'bar',
              label: {
                  normal: {
                      show: true
                  }
              },
              data: data
          };

          this.series.push(object);
          that.myChart.setOption(this);
      },
      pushLegendAndSeries: function(name,data){
          this.legend.data.push(name);
          var object = {
              name: name,
              type: 'line',
              label: {
                  normal: {
                      show: true
                  }
              },
              data: data
          };
          this.series.push(object);
          that.myChart.setOption(this);
      },
      clearSeries: function() {
          this.series = [];
          that.myChart.setOption(this,true);
      }

  };
  this.setOption = function(option){
      this.myChart.setOption(option);
  };

}

function EchartsPie(item) {
  this.myChart = echarts.init(item);
  var that = this;
  this.option = {
      title: {
          text: '折线图',
          left: 'left',
          top: 6,
          textStyle:{
              fontSize:12
          }
      },
      color:[
          'rgba(255,0,0,1)',
          'rgba(0,255,0,1)',
          'rgba(0,0,255,1)',
          'rgba(125,125,0,1)',
          'rgba(125,0,125,1)',
          'rgba(0,125,125,1)'
      ],
      // color:[
      //     '#c23531',
      //     '#2f4554',
      //     '#61a0a8',
      //     '#d48265',
      //     '#91c7ae',
      //     '#749f83',
      //     '#ca8622',
      //     '#bda29a',
      //     '#6e7074',
      //     '#546570',
      //     '#c4ccd3'
      // ],
      tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c}"
      },
      legend: {
          show:false,
          orient: 'vertical',
          x: 'left',
          data:[]
      },
      series: [
          {
              name:'占比',
              type:'pie',
              radius: ['0', '70%'],
              avoidLabelOverlap: false,
              label: {
                  normal: {
                      show: false,
                      //position: 'center'
                  },
                  emphasis: {
                      show: false,
                      textStyle: {
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  }
              },
              labelLine: {
                  normal: {
                      show: false
                  }
              },
              data:[

              ]
          }
      ],

      setLegend: function(legend){
          this.legend.data = legend;
      },
      pushLegend: function(legend){
          this.legend.data.push(legend);
          that.myChart.setOption(this);
      },
      setXAxis: function(xAxis){
          this.xAxis[0].data = xAxis;
          that.myChart.setOption(this,true);
      },
      pushSeries: function(name,data){
          var object = {
              name: name,
              value: data
          };
          this.series[0].data.push(object);
          that.myChart.setOption(this);
      },
      pushLegendAndSeries: function(name,data){
          this.legend.data.push(name);
          var object = {
              name: name,
              value: data
          };
          this.series[0].data.push(object);
          that.myChart.setOption(this);
      },
      clearSeries:function(){
          this.series = [];
          that.myChart.setOption(this,true);
      }

  };
  this.setOption = function(option){
      this.myChart.setOption(option);
  };

}

function EchartsRadar(item) {
  this.myChart = echarts.init(item);
  var that = this;
  this.option = {
      title: {
          text: '基础雷达图'
      },
      tooltip: {},
      legend: {
          data: []
      },
      radar: {
          // shape: 'circle',
          name: {
              textStyle: {
                  color: '#000',
                  // backgroundColor: '#999',
                  borderRadius: 3,
                  padding: [3, 5]
              },
              fontSize:10,
          },
          nameGap:0,
          radius: 50,
          startAngle:135,
          indicator: [

          ]
      },
      series: [{
          name: '使用量占比',
          type: 'radar',
          // areaStyle: {normal: {}},
          data: [

          ]
      }],
      setLegend: function (legend) {
          this.legend.data = legend;
      },
      pushLegend: function (legend) {
          this.legend.data.push(legend);
          that.myChart.setOption(this);
      },
      setXAxis: function (xAxis) {
          this.xAxis[0].data = xAxis;
          that.myChart.setOption(this, true);
      },
      pushRadar: function(name,data){
          this.radar.indicator.push({name:name,max:data});
          that.myChart.setOption(this);
      },
      pushSeries: function (name, data) {
          var object = {
              name: name,
              value: data
          };
          this.series[0].data.push(object);
          that.myChart.setOption(this);
      },
      pushLegendAndSeries: function (name, data) {
          this.legend.data.push(name);
          var object = {
              name: name,
              value: data
          };
          this.series[0].data.push(object);
          that.myChart.setOption(this);
      },
      clearSeries: function () {
          this.series = [];
          that.myChart.setOption(this, true);
      }
  };
  this.setOption = function(option){
      this.myChart.setOption(option);
  };
}