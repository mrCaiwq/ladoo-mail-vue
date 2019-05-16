<template>
  <div>
    <Table :columns="batchMailColumns" :data="batchMailList">

      <template slot-scope="{ row }" slot="created_at">
        <span>{{ formatTime(row.created_at) }}</span>
      </template>

      <template slot-scope="{ row }" slot="is_admin">
        <span>{{ $t(String(row.is_admin)) }}</span>
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
import { getUserList } from '@/api/user'
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
          title: '姓名',
          key: 'name',
          width: 100
        },
        {
          title: '手机号',
          key: 'cellphone'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '创建时间',
          slot: 'created_at',
          width: 160
        },
        {
          title: '是否为管理员',
          slot: 'is_admin',
          width: 80
        }
      ],
      batchMailList: []
    }
  },

  beforeMount () {
    this.fetchUsers()
  },

  methods: {
    formatTime,

    fetchUsers () {
      let param = {
        page: this.page,
        per_page: this.perPage
      }
      getUserList(param).then(res => {
        let { data, meta } = res.data
        this.batchMailList = data
        this.total = meta.total_count
      })
    },

    changePage (page) {
      this.page = page
      this.fetchUsers()
    }
  }
}
</script>
