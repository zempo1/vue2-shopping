<template>
    <div class="chart-container">
        <div class="title">
            <el-select v-model="titleType" placeholder="请选择" @change="handleChange">
               <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
                </el-option>
            </el-select>
        </div>
        <div class="com-chart" ref="trend_ref"></div>
    </div>
</template>

<script>

export default {

    data() {
        return {
            chartInstance: null,
            charData: null,
            titleType: 'map',
            titleFontSize: 0,
            types: [
                {
                    value: 'map',
                    label: '地区销量趋势'
                },
                {
                    value: 'goods',
                    label: '商品销量趋势'
                },
                {
                    value: 'merchant',
                    label: '商家销量趋势'
                }
            ]
        }
    },
    mounted() {
        this.initChart()
        this.getData()
        window.addEventListener('resize', this.screenAdapter)
        this.screenAdapter()
    },
    methods: {
        initChart() {
            this.chartInstance = this.$echarts.init(this.$refs.trend_ref)
            const initOption = {
                color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
                grid: {
                    left:'3%',
                    top:'28%',
                    right:'4%',
                    bottom:'1%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                legend: {
                    icon: 'circle',
                    top: '15%',
                    left: 20,
                    textStyle: {
                        fontSize: 18
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false
                },
                yAxis: {
                    type: 'value',
                }
            }
            this.chartInstance.setOption(initOption)
        },
        getData() {
            this.charData = 
                {
                    map: {
                        title: '地区销量趋势',
                        base: 310,
                        unit: '万',
                        data: [
                            {
                                name: '上海',
                                data: [
                                    //一到十二月的数据
                                    100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200
                                ]
                            },
                            {
                                name: '北京',
                                data: [
                                    //十二个随机数
                                    150, 130, 164, 324, 564, 745, 615, 845, 924, 789, 1050, 1120
                                ]
                            },
                            {
                                name: '广州',
                                data: [
                                    120, 140, 150, 230, 350, 480, 520, 650, 720, 850, 980, 1020
                                ]
                            }
                        ]
                    },
                    goods: {
                        title: '商品销量趋势',
                        base: 1000,
                        unit: '件',
                        data: [
                            {
                                name: '手机',
                                data: [
                                    1000, 2000,1305, 3204, 5604, 7045, 6105, 8045, 9240, 7890, 9000, 9200
                                ]
                            },
                            {
                                name: '电脑',
                                data: [
                                    1500, 1300, 1640, 3240, 5640, 7450, 6150, 8450, 9240, 7890, 10500, 11200
                                ]
                            },
                            {
                                name: '相机',
                                data: [
                                    1300,2500,5080,3200,8000,6150,8450,9240,7890,9048,10000,10700
                                ]
                            }
                        ]
                    },
                    merchant: {
                        title: '商家销量趋势',
                        base: 10000,
                        unit: '元',
                        data: [
                            {
                                name: '商家A',
                                data: [
                                    10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000
                                ]
                            },
                            {
                                name: '商家B',
                                data: [
                                    15000, 13000, 16400, 32400, 56400, 74500, 61500, 84500, 92400, 78900, 105000, 112000
                                ]
                            },
                            {
                                name: '商家C',
                                data: [
                                    12000, 14000, 15000, 23000, 35000, 48000, 52000, 65000, 72000, 85000, 98000, 102000
                                ]
                            }
                        ]
                    },
                    month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
                }
            this.updateChart()
        },
        updateChart() {
            // 区域颜色
            const colorArr1 = [
                'rgb(128, 255, 165,0.8)',
                'rgb(0, 221, 255,0.8)',
                'rgb(55, 162, 255,0.8)',
                'rgb(255, 0, 135,0.8)',
                'rgb(255, 191, 0,0.8)'
            ]
            const colorArr2 = [
                'rgb(1, 191, 236,0.7)',
                'rgb(77, 119, 255,0.7)',
                'rgb(116, 21, 219,0.7)',
                'rgb(135, 0, 157,0.7)',
                'rgb(224, 62, 76,0.7)'
            ]
            //处理数据
            //x轴数据
            const timeArr = this.charData.month
            //y轴数据
            const valueArr = this.charData[this.titleType].data
            const seriesArr = valueArr.map((item,index) =>{
                return {
                    type: 'line',
                    name: item.name,
                    data: item.data,
                    stack: this.titleType,//堆叠图
                    smooth: true, //平滑折线
                    //区域面积图
                    areaStyle:{
                        color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                              offset: 0,
                              color: colorArr1[index]
                            },
                            {
                              offset: 1,
                              color: colorArr2[index]
                            }
                        ]),
                    },
                    emphasis: {
                        focus: 'series'
                    },       
                }
            })
            console.log(timeArr,seriesArr);
            const legendArr = valueArr.map((item =>{
                return item.name
            }))
            const dataOption = {
                xAxis: {
                    data: timeArr
                },
                //图例,最上面各种线的名字
                legend: {
                    data: legendArr,
                },
                series: seriesArr
            }
            this.chartInstance.setOption(dataOption)
        },
        // 分辨率适配
        screenAdapter() {
            this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 *3.2
            const adapterOption = {}
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        },
        handleChange() {
            this.updateChart()
        }
    }
}

</script>

<style lang="scss" scoped>

.title {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 2;
}
// ::v-deep .el-input {
//     font-size: 24px;
// }
// ::v-deep .el-input__inner {
//     height: 68px;
//     line-height: 68px;
// }
// .el-select-dropdown__item{
//     font-size: 24px;
//     height: 62px;
//     line-height: 62px;
// }
</style>