
<template>
  <div>
    <Table :columns="mailColumns" :data="mails">
      <template slot-scope="{ row }" slot="subject">
        <strong>{{ row.subject }}</strong>
        <span class="mail-content" >{{ " - " + extractContentFromHtml(row.content) }}</span>
      </template>

      <template slot-scope="{ row }" slot="recipient">
        <span>{{ row.recipient }}{{ row.recipient_address }}</span>
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
        }
      ],
      mails: [],
      page: 1,
      total: 10,
      perPage: 20
    }
  },

  beforeMount () {
    this.fetchEmails()
  },

  methods: {
    fetchEmails () {
      let param = {
        page: this.page,
        per_page: this.perPage
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

    extractContentFromHtml (htmlString) {
      return htmlString.replace(/<[^>]+>/g, ' ')
    }
  }
}
</script>

<style lang="less" scoped>

.mail-content {
  color: @subsidiary-color
}
</style>
