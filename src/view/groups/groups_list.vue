<template>
  <div>
    <div class="filter-wrapper">
      <Button type="primary" @click="showGroupModal">创建分组</Button>
    </div>
    <Table :columns="groupColumns" :data="groups"></Table>
    <Page
      :current.sync="page"
      :total="total"
      :page-size="perPage"
      @on-change="changePage"
      show-elevator
      show-total
    />

    <Modal v-model="visibleModal" width="360">
      <p slot="header" class="modal-header">
        <span>创建联系人分组</span>
      </p>
      <Form ref="groupForm" :model="groupForm" :rules="ruleCustom" :label-width="80">
        <FormItem label="姓名" prop="name">
          <Input type="text" v-model="groupForm.name"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submitForm">创建</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { createGroup, getGroupList } from '@/api/group'

export default {
  data () {
    return {
      visibleModal: false,
      groupColumns: [
        {
          title: '编号',
          key: 'id'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '创建时间',
          key: 'created_at'
        }
      ],
      groups: [],
      page: 1,
      total: 10,
      perPage: 30,
      groupForm: {
        name: ''
      },
      ruleCustom: {
        name: { required: true, message: '标题不能为空', trigger: 'blur' }
      }
    }
  },

  beforeMount () {
    this.fetchGroups()
  },

  methods: {
    showGroupModal () {
      this.visibleModal = true
    },

    fetchGroups () {
      let param = {
        page: this.page,
        per_page: this.perPage
      }
      getGroupList(param).then(res => {
        let { data, meta } = res.data
        this.groups = data
        this.total = meta.total_count
      })
    },

    changePage (page) {
      this.page = page
      this.fetchGroups()
    },

    submitForm () {
      this.$refs['groupForm'].validate((valid) => {
        if (!valid) return
        this.createGroup()
      })
    },

    createGroup () {
      createGroup(this.groupForm).then(res => {
        this.$Message.success('创建成功')
        this.visibleModal = false
        this.fetchGroups()
      })
    }
  }
}
</script>
