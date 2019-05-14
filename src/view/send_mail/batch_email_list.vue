<template>
  <div>
    <Table :columns="batchMailColumns" :data="batchMailList">
      <template slot-scope="{ row }" slot="subject">
        <router-link :to="`/send_mail/mail_detail/${row.id}`">
          <strong>{{ row.subject }}</strong>
          <span class="mail-content">{{ " - " + extractContentFromHtml(row.content) }}</span>
        </router-link>
      </template>

       <template slot-scope="{ row }" slot="created_at">
        <span>{{ formatTime(row.created_at) }}</span>
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
import { getBatchEmailList } from '@/api/batch_email'
import { extractContentFromHtml } from '@/libs/util'
import { formatTime } from '@/libs/time'

export default {
  data () {
    return {
      page: 1,
      total: 10,
      perPage: 30,

      batchMailColumns: [
        {
          title: '编号',
          key: 'id',
          width: 80
        },
        {
          title: '发送人',
          key: 'sender_name'
        },
        {
          title: '主题',
          slot: 'subject',
          ellipsis: true
        },
        {
          title: '创建时间',
          slot: 'created_at',
          width: 160
        },
        {
          title: '总数',
          width: 80,
          key: 'recipient_count'
        },
        {
          title: '收到数量',
          width: 80,
          key: 'delivered_count'
        },
        {
          title: '打开数量',
          width: 80,
          key: 'opened_count'
        },
        {
          title: '点击数量',
          width: 80,
          key: 'clicked_count'
        },
        {
          title: '失败数量',
          width: 80,
          key: 'failed_count'
        }
      ],
      batchMailList: []
    }
  },

  beforeMount () {
    this.fetchBatchEmails()
  },

  methods: {
    extractContentFromHtml,
    formatTime,

    fetchBatchEmails () {
      let param = {
        page: this.page,
        per_page: this.perPage
      }
      getBatchEmailList(param).then(res => {
        let { data, meta } = res.data
        this.batchMailList = data
        this.total = meta.total_count
      })
    },

    changePage (page) {
      this.page = page
      this.fetchBatchEmails()
    }
  }
}
</script>
