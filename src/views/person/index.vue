<template>
  <section class="person_container">
    <el-tabs :active-name="activeTab">
      <el-tab-pane label="基本信息" name="baseInfo">
        <base-info />
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="pwd">
        <pwd />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import BaseInfo from '@/views/person/components/BaseInfo'
import Pwd from '@/views/person/components/Pwd'
import {mapState} from 'vuex'
import {refreshPersonal} from '@/api/purview'
import {ShowMsg} from '@/utils/common'

export default {
  name: 'PersonView',
  components: {Pwd, BaseInfo},
  data() {
    return {
      activeTab: 'baseInfo',
    }
  }
}
</script>