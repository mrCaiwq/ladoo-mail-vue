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
    <br>
    <Row>
      <h1>每小时邮件统计</h1>
      <Card shadow>
        <LineChart :categories="hour.categories" :series="hour.series" style="height: 400px"/>
      </Card>
    </Row>
    <br>
     <Row>
      <h1>每天邮件统计</h1>
      <Card shadow>
        <LineChart :categories="day.categories" :series="day.series" style="height: 400px"/>
      </Card>
    </Row>
    <br>
     <Row>
      <h1>每周邮件统计</h1>
      <Card shadow>
        <LineChart :categories="week.categories" :series="week.series" style="height: 400px"/>
      </Card>
    </Row>
    <br>
     <Row>
      <h1>每月邮件统计</h1>
      <Card shadow>
        <LineChart :categories="month.categories" :series="month.series" style="height: 400px"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '@c/info-card'
import CountTo from '@c/count-to'
import { ChartPie, ChartBar } from '@c/charts'
import LineChart from './line_chart'
import { getMailCount, getMailGroup } from '@/api/statistic'
import moment from 'moment'

export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    LineChart
  },
  data() {
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
      },
      hour: {
        series: [],
        categories: []
      },
      day: {
        series: [],
        categories: []
      },
      week: {
        series: [],
        categories: []
      },
      month: {
        series: [],
        categories: []
      }
    }
  },

  computed: {
    inforCardData() {
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

  beforeMount() {
    this.fetchMailCountStat()

    this.fetchMailGroupStat({
      period: 'hour',
      begin_at: moment().subtract(24, 'hours').toString(),
      end_at: moment().toString()
    })
    this.fetchMailGroupStat({
      period: 'day',
      begin_at: moment().subtract(30, 'days').toString(),
      end_at: moment().toString()
    })
    this.fetchMailGroupStat({
      period: 'week',
      begin_at: moment().subtract(7, 'weeks').toString(),
      end_at: moment().toString()
    })
    this.fetchMailGroupStat({
      period: 'month',
      begin_at: moment().subtract(5, 'months').toString(),
      end_at: moment().toString()
    })
  },

  methods: {
    fetchMailCountStat() {
      getMailCount().then(res => {
        this.mailCountStat = Object.assign({},
          {
            mailCountToday: res.data.data.mail_count_today,
            mailCountYesterday: res.data.data.mail_count_yesterday,
            mailCountIn7days: res.data.data.mail_count_in_7days,
            mailCountIn30days: res.data.data.mail_count_in_30days
          }
        )
      })
    },

    fetchMailGroupStat(params) {
      getMailGroup(params).then(res => {
        this.importToChartData(params.period, res.data.data)
      })
    },

    importToChartData(period, resBody) {
      let categories = Object.keys(resBody.send_group)
      let series = []
      for (var property in resBody) {
        if (resBody.hasOwnProperty(property)) {
          let data = Object.values(resBody[property])

          series.push({
            name: this.$t(`statistic.group.${property}`),
            type: 'line',
            data
          })
        }
      }
      this[period].series = series
      this[period].categories = categories
    }
  }
}
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
