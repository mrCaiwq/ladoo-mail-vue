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
import { createGroup } from '@/api/group'

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
      groups: [
        {
          id: 9,
          created_at: '2019-04-29T00:17:21.336+08:00',
          name: 'name-7',
          organization_id: 13,
          position: 0,
          updated_at: '2019-04-29T00:17:21.336+08:00',
          user_id: 13,
          contacts: [
            {
              id: 11,
              company: 'Coca Cola',
              created_at: '2019-04-29T00:17:21.341+08:00',
              description: 'description',
              email: 'recipient-8@example.com',
              gender: null,
              group_id: 9,
              name: 'recipient-8',
              organization_id: 13,
              updated_at: '2019-04-29T00:17:21.341+08:00',
              user_id: 13
            }
          ]
        },
        {
          id: 11,
          created_at: '2019-04-29T00:17:21.353+08:00',
          name: 'name-9',
          organization_id: 13,
          position: 1,
          updated_at: '2019-04-29T00:17:21.353+08:00',
          user_id: 13,
          contacts: [
            {
              id: 13,
              company: 'Coca Cola',
              created_at: '2019-04-29T00:17:21.358+08:00',
              description: 'description',
              email: 'recipient-10@example.com',
              gender: null,
              group_id: 11,
              name: 'recipient-10',
              organization_id: 13,
              updated_at: '2019-04-29T00:17:21.358+08:00',
              user_id: 13
            }
          ]
        }
      ],
      page: 1,
      total: 10,
      perPage: 20,
      groupForm: {
        name: ''
      },
      ruleCustom: {
        name: { required: true, message: '标题不能为空', trigger: 'blur' }
      }
    }
  },

  methods: {
    showGroupModal () {
      this.visibleModal = true
    },

    changePage () {

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
      })
    }
  }
}
</script>
