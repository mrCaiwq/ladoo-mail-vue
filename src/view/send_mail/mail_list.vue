<template>
  <div>
    <div class="filter-wrapper">
      <Form ref="searchForm" :model="searchForm" inline>
        <FormItem prop="email">
          <Input type="text" v-model="searchForm.recipient_address" placeholder="收件邮箱"/>
        </FormItem>
        <FormItem prop="name">
          <Input type="text" v-model="searchForm.subject" placeholder="主题"/>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="fetchEmails">查询</Button>
        </FormItem>
      </Form>
    </div>
    <Table :columns="mailColumns" :data="mails">
      <template slot-scope="{ row }" slot="subject">
        <strong>{{ row.subject }}</strong>
        <span class="mail-content" >{{ " - " + extractContentFromHtml(row.content) }}</span>
      </template>

      <template slot-scope="{ row }" slot="recipient">
        <span>{{ row.recipient }}{{ row.recipient_address }}</span>
      </template>

      <template slot-scope="{ row }" slot="state">
        <Tag :color="getStateTagColor(row.state)">{{ getStateName(row.state) }}</Tag>
      </template>
    </Table>
    <Page
      :current.sync="page"
      :total="total"
      :page-size="perPage"
      @on-change="changePage"
      show-elevator
      show-total
    />
  </div>
</template>
<script>
import { getEmailList } from '@/api/email'
import { extractContentFromHtml } from '@/libs/util'

export default {
  data () {
    return {
      mailColumns: [
        {
          title: '收件人',
          width: 200,
          slot: 'recipient'
        },
        {
          title: '主题',
          slot: 'subject',
          ellipsis: true
        },
        {
          title: '时间',
          key: 'created_at',
          width: 260
        },
        {
          title: '状态',
          slot: 'state',
          width: 260
        }
      ],
      mails: [],
      page: 1,
      total: 10,
      perPage: 20,
      stateName: {
        ready: '未发送',
        delivering: '发送中',
        delivered: '已发送',
        opened: '已阅读',
        failure: '失败',
        rejected: '拒绝发送',
        clicked: '已点击'
      },
      stateTagColor: {
        ready: 'default',
        delivering: 'default',
        delivered: 'primary',
        opened: 'success',
        failure: 'error',
        rejected: 'error',
        clicked: 'success'
      },

      searchForm: {
        recipient: null,
        subject: null
      }
    }
  },

  beforeMount () {
    this.fetchEmails()
  },

  methods: {
    extractContentFromHtml,
    fetchEmails () {
      let param = {
        page: this.page,
        per_page: this.perPage,
        ...this.searchForm
      }
      getEmailList(param).then(res => {
        let { data, meta } = res.data
        this.mails = data
        this.total = meta.total_count
      })
    },

    changePage (page) {
      this.page = page
      this.fetchEmails()
    },

    getStateTagColor (state) {
      return this.stateTagColor[state]
    },

    getStateName (state) {
      return this.stateName[state]
    }
  }
}
</script>

<style lang="less" scoped>

.mail-content {
  color: @subsidiary-color
}
</style>
