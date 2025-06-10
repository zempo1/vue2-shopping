<!-- 商家销量统计的横向柱状图 -->
<template>
    <div class="chart-container">
       <div class="com-chart" ref="seller_ref"></div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            chartInstance: null,
            chartData: []
        }
    },
    mounted() {
        this.initChart();
        this.getData();
        window.addEventListener('resize', this.screenAdapter)
        this.screenAdapter()
    },
    destroyed() {
        window.removeEventListener('resize', this.screenAdapter)
    },
    methods: {
       initChart() {
          this.chartInstance = this.$echarts.init(this.$refs.seller_ref)
         // 对图标初始化配置的控制
          const initOptions = {
            title: {
              text: '丨 商家销售统计',
              left: 20,
              top: 20,
            },
            grid: {
                top: '13%',
                left: '3%',
                right: '6%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
            },
            yAxis: {
                type: 'category',
            },
            tooltip: {
                // 鼠标悬停提示框，用于悬停在柱状图上时改变背景颜色
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    z: 0,
                    lineStyle: {
                        color: '#eee',
                        type: 'solid',
                    }
                }
            },
            series: [
                {
                    type: 'bar',//柱状图
                    label: {
                        //图形上的文本标签
                        show: true,
                        position: 'right',
                    },
                    itemStyle: {
                        //指明不同百分比下颜色的值
                        color: new this.$echarts.graphic.LinearGradient(0 , 0 ,1 ,0,[
                            {
                                offset: 0,
                                color: '#5052EE'
                            },
                            {
                                offset: 1,
                                color: '#AB6EE5'
                            }
                        ])
                    }
                }
            ]
          }
          this.chartInstance.setOption(initOptions);
       },
       getData() {
          // 模拟数据
          for(let i = 0; i < 7; i++) {
             this.chartData.push({
                name: `商家${i+1}`,
                value: Math.floor(Math.random() * 1000)
             })
          }
          console.log(this.chartData);
          this.chartData.sort((a,b)=>{
            return a.value - b.value //从小到大排序
          })
          this.updateChart();
       },
       updateChart() {
          const sellerNames = this.chartData.map(item => item.name);
          const sellerValues = this.chartData.map(item => item.value);
          const dataOption = {
            yAxis: {
                data: sellerNames
            },
            series: [
                {
                  data: sellerValues,
                }
            ]
        };
         this.chartInstance.setOption(dataOption);
       },
       // 屏幕适配
       screenAdapter() {
          const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.2;
          //和分辨率有关的配置项
          const adapterOption = {
            title: {
              textStyle: {
                fontSize:titleFontSize
              }
            },
            tooltip: {
                // 鼠标悬停提示框，用于悬停在柱状图上时改变背景颜色
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        width: titleFontSize,
                    }
                }
            },
            series: [
                {
                    barWidth: titleFontSize,
                    itemStyle: {
                        //柱状图的圆角 
                        borderRadius: [0, titleFontSize/2, titleFontSize/2, 0],
                    }
                }
            ] 
          }
          this.chartInstance.setOption(adapterOption)
          // 手动调用图表的resize方法才能产生效果
          this.chartInstance.resize();
       }
    },
}

</script>

<style lang="scss" scoped>

</style>