<template>
  <section class="home_container">
    <h3 class="hello mb_10">欢迎您！{{user.name}}</h3>
    <p>{{text}}</p>
    <el-divider></el-divider>
    <el-row :gutter="20">
      <el-col :span="12">
        <h4 class="title mb_20">后台系统说明</h4>
        <p style="text-indent: 2em">{{info}}</p>
        <p class="mt_10 mb_10">
          <el-button type="danger" size="medium" icon="el-icon-phone">联系管理员: 18671882817</el-button>
          <el-button type="primary" size="medium" icon="el-icon-user">QQ: 906645272</el-button>
          <el-button type="primary" size="medium" icon="el-icon-link" @click="go">GitHub源码</el-button>
        </p>
        <el-card class="mt_20" style="width: 480px" header="微信添加好友">
          <el-image src="https://web-online-career.oss-cn-hangzhou.aliyuncs.com/resource/admin.jpg"></el-image>
        </el-card>
      </el-col>
      <el-col :span="12">
        <h4 class="title mb_20">技术栈</h4>
        <el-row :gutter="10">
          <el-col :span="12">
            <h5 class="title_sub mb_20">后端</h5>
            <p class="mt_10 mb_10" v-for="item in back" :key="item">{{item}}</p>
          </el-col>
          <el-col :span="12">
            <h5 class="title_sub mb_20">前端</h5>
            <p class="mt_10 mb_10" v-for="item in front" :key="item">{{item}}</p>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import {mapState} from 'vuex'
import {getBeautyArr} from '@/api/user'
import {ShowMsg} from '@/utils/common'

export default {
  name: "HomeView",
  components: {},
  data() {
    return {
      text: '',
      info: '这是一款专门针对于网上求职与招聘系统设计的框架，代码简单，结构清晰，' +
        '使用起来很方便。为了生活中求职与招聘服务更好的智能化操作，能为求职招聘人员提供便捷的服务、准确可靠的信息、数字化的管理。',
      back: [
        'SpringBoot@2',
        'Hutool',
        'LomBok',
        'MyBatis/MyBatis-Plus',
        '阿里云OSS对象存储服务'
      ],
      front: [
        'Vue@2',
        'Vuex',
        'Vue-Router',
        'Axios',
        'Mavon-Editor',
        'Element-UI',
        'Element-China-Area-Data'
      ]
    };
  },
  created() {
    this.loadArr()
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    go() {
      window.open('https://github.com/Glfaw/back_online_career')
    },
    async loadArr() {
      try {
        const res = await getBeautyArr()
        if (res.status === 200) {
          this.text = res.data.txet
        } else ShowMsg(res.statusText)
      } catch (e) {
        ShowMsg(e.message, 'error')
      }
    }
  },
};
</script>

<style lang="less">
.home_container {
  .hello {
    font-size: 32px;
    font-weight: 400;
  }

  .title {
    font-size: 22px;
    font-weight: 400;
  }

  .title_sub {
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
