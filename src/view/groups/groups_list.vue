<template>
  <div>
    <div class="filter-wrapper">
      <Button type="primary" @click="showGroupModal">创建分组</Button>
    </div>
    <Table :columns="groupColumns" :data="groups">
       <template slot-scope="{ row }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="showUpdateModal(row)">修改</Button>
          <Button type="error" size="small" @click="remove(row)">删除</Button>
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

    <Modal v-model="visibleModal" width="360">
      <p slot="header" class="modal-header">
        <span>创建联系人分组</span>
      </p>
      <Form ref="groupForm" :model="groupForm" :rules="ruleCustom" :label-width="80">
        <FormItem label="名称" prop="name">
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
import { createGroup, getGroupList, updateGroup, deleteGroup } from '@/api/group'

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
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      groups: [],
      page: 1,
      total: 10,
      perPage: 30,
      groupForm: {
        id: null,
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

        if (this.groupForm.id) {
          this.updateGroup()
        } else {
          this.createGroup()
        }
      })
    },

    createGroup () {
      createGroup(this.groupForm).then(res => {
        this.$Message.success('创建成功')
        this.visibleModal = false
        this.fetchGroups()
      })
    },

    updateGroup () {
      updateGroup(this.groupForm).then(res => {
        this.$Message.success('修改成功')
        this.visibleModal = false
        this.fetchGroups()
      })
    },

    showUpdateModal (group) {
      this.groupForm = Object.assign({}, group)
      this.visibleModal = true
    },

    remove (group) {
      this.$Modal.confirm({
        loading: true,
        title: '确认要删除该分组吗？',
        onOk: () => {
          deleteGroup(group.id).then(res => {
            this.fetchGroups()
            this.$Message.success('删除成功')
            this.$Modal.remove()
          })
        }
      })
    }
  }
}
</script>
