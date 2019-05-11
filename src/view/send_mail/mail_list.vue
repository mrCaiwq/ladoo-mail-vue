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
        <router-link :to="`/send_mail/mail_detail/${row.id}`">
          <strong>{{ row.subject }}</strong>
          <span class="mail-content">{{ " - " + extractContentFromHtml(row.content) }}</span>
        </router-link>
      </template>

      <template slot-scope="{ row }" slot="recipient">
        <span>{{ row.recipient }}{{ row.recipient_address }}</span>
      </template>

      <template slot-scope="{ row }" slot="created_at">
        <span>{{ formatTime(row.created_at) }}</span>
      </template>

      <template slot-scope="{ row }" slot="state">
        <Tag :color="getStateTagColor(row.state)">{{ $t(`email.state.${row.state}`) }}</Tag>
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
import { formatTime } from '@/libs/time'
import { getStateTagColor } from '@/libs/tag'

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
          slot: 'created_at',
          width: 160
        },
        {
          title: '状态',
          slot: 'state',
          filters: [
            { label: '未发送', value: 'ready' },
            { label: '发送中', value: 'delivering' },
            { label: '已发送', value: 'delivered' },
            { label: '已阅读', value: 'opened' },
            { label: '失败', value: 'failure' },
            { label: '拒绝发送', value: 'rejected' },
            { label: '已点击', value: 'clicked' }
          ],
          filterMultiple: false,
          filterRemote: this.filterByState,
          width: 160
        }
      ],
      mails: [],
      page: 1,
      total: 10,
      perPage: 20,
      searchForm: {
        recipient: null,
        subject: null,
        state: null
      }
    }
  },

  beforeMount () {
    this.fetchEmails()
  },

  methods: {
    extractContentFromHtml,
    formatTime,
    getStateTagColor,
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

    filterByState (states) {
      this.searchForm.state = states[0]
      this.fetchEmails()
    }
  }
}
</script>

<style lang="less" scoped>
.mail-content {
  color: @subsidiary-color;
}
</style>
