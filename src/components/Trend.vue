<template>
    <div class="chart-container">
        <div class="com-chart" ref="trend_ref"></div>
    </div>
</template>

<script>
export default {

    data() {
        return {
            chartInstance: null,
            charData: []
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

            }
            this.chartInstance.setOption(initOption)
        },
        getData() {
            
            this.updateChart()
        },
        updateChart() {
            //处理数据
            const dataOption = {

            }
            this.chartInstance.setOption(dataOption)
        },
        // 分辨率适配
        screenAdapter() {

            const adapterOption = {}
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        }
    }
}

</script>

<style lang="scss" scoped>

</style>