<template>
  <section class="home_container">
    <!--  统计  -->
    <el-row class="count" :gutter="20">
      <el-col :span="8">
        <el-card style="height: 150px; color: #409EFF;">
          <div slot="header">
            <span class="el-icon-s-custom el-icon--left"></span>
            <span>用户统计</span>
          </div>
          <div>200</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="height: 150px; color: #67C23A;">
          <div slot="header">
            <span class="el-icon-tickets el-icon--left"></span>
            <span>招聘信息</span>
          </div>
          <div>200</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="height: 150px; color: #E6A23C;">
          <div slot="header">
            <span class="el-icon-user el-icon--left"></span>
            <span>求职者</span>
          </div>
          <div>200</div>
        </el-card>
      </el-col>
    </el-row>
    <!--  echarts  -->
    <el-row class="assay mt_20" :gutter="20">
      <el-col :span="18">
        <el-card>
          <div slot="header">
            <span>数据分析</span>
            <div class="fl_r command">
              <span>操作1</span>
            </div>
          </div>
          <div class="es" ref="echarts"></div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div slot="header">
            <span>快捷导航</span>
          </div>
          <div>
            <el-button type="primary">我要发布</el-button>
            <el-button type="primary">我要发布</el-button>
            <el-divider></el-divider>
            <el-button type="primary">我要发布</el-button>
            <el-button type="primary">我要发布</el-button>
            <el-button type="primary">我要发布</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: "HomeView",
  components: {},
  data() {
    return {
      currentDate: new Date()
    };
  },
  mounted() {
    this.loadEcharts()
  },
  methods: {
    loadEcharts() {
      echarts.init(this.$refs.echarts).setOption({
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'bar',
            smooth: true
          }
        ]
      })
    },

  },
};
</script>

<style lang="less">
.home_container {
  .es {
    height: 500px;
  }
}
</style>
