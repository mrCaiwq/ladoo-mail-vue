<template>
  <div>
    <Row :gutter="20">
      <i-col
        :xs="24"
        :md="12"
        :lg="12"
        v-for="(infor, i) in inforCardData"
        :key="`infor-${i}`"
        style="height: 120px;padding-bottom: 10px;"
      >
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style" :simplify="true"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="用户访问来源"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example style="height: 310px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '@c/info-card'
import CountTo from '@c/count-to'
import { ChartPie, ChartBar } from '@c/charts'
import Example from './example.vue'
import { getMailCount } from '@/api/statistic'

export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      mailCountStat: {
        mailCountToday: 0,
        mailCountYesterday: 0,
        mailCountIn7days: 0,
        mailCountIn30days: 0
      },
      pieData: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      }
    }
  },

  computed: {
    inforCardData () {
      return [
        {
          title: '今日发送',
          icon: 'md-person-add',
          count: this.mailCountStat.mailCountToday,
          color: '#2d8cf0'
        },
        {
          title: '昨日发送',
          icon: 'md-bulb',
          count: this.mailCountStat.mailCountYesterday,
          color: '#19be6b'
        },
        {
          title: '7天发送',
          icon: 'ios-send',
          count: this.mailCountStat.mailCountIn7days,
          color: '#ff9900'
        },
        {
          title: '30天发送',
          icon: 'md-shuffle',
          count: this.mailCountStat.mailCountIn30days,
          color: '#ed3f14'
        }
      ]
    }
  },

  beforeMount () {
    this.fetchMailCountStat()
  },

  methods: {
    fetchMailCountStat () {
      getMailCount().then(res => {
        this.mailCountStat = Object.assign({}, {
          mailCountToday: res.data.data.mail_count_today,
          mailCountYesterday: res.data.data.mail_count_yesterday,
          mailCountIn7days: res.data.data.mail_count_in_7days,
          mailCountIn30days: res.data.data.mail_count_in_30days
        })
      })
    }
  }
}
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
