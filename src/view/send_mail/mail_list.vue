
<template>
  <div>
    <Table :columns="mailColumns" :data="mails"></Table>
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
          key: 'recipient_address',
          width: 200
        },
        {
          title: '主题',
          key: 'subject'
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
    }
  }
}
</script>
