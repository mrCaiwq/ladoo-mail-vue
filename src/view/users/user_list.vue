<template>
  <div>
    <div class="filter-wrapper">
      <Button type="primary" @click="onClickCreateUserBtn">创建联系人</Button>
    </div>
    <Table :columns="userColumns" :data="userList">

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

    <Modal v-model="isModalVisible" width="360">
      <p slot="header" class="modal-header">
        <span> {{ formTitle }} </span>
      </p>
      <Form ref="userForm" :model="userForm" :rules="userFormRule" :label-width="80">
        <FormItem label="姓名" prop="name">
          <Input type="text" v-model="userForm.name"/>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input type="text" v-model="userForm.email"/>
        </FormItem>
        <FormItem label="手机" prop="cellphone">
          <Input type="text" v-model="userForm.cellphone"/>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="password" v-model="userForm.password"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="onSubmitForm"> {{ formSubmitText }} </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getUserList, createUser } from '@/api/user'
import { formatTime } from '@/libs/time'

export default {
  data () {
    return {
      page: 1,
      total: 10,
      perPage: 30,

      userColumns: [
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
      userList: [],

      isModalVisible: true,

      userForm: {
        id: null,
        name: null,
        email: null,
        password: null,
        cellphone: null
      },
      userFormRule: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'change' },
          { type: 'email', message: '邮件格式不正确', trigger: 'change' }
        ],
        name: { required: true, message: '姓名不能为空', trigger: 'change' },
        password: { required: true, message: '密码不能为空', trigger: 'change' }
      }
    }
  },

  beforeMount () {
    this.fetchUsers()
  },

  computed: {
    isCreate () {
      return typeof this.userForm.id === 'undefined' || this.userForm.id === null
    },
    formTitle () {
      return this.isCreate ? '创建员工' : '修改员工'
    },
    formSubmitText () {
      return this.isCreate ? '创建' : '修改'
    }
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
        this.userList = data
        this.total = meta.total_count
      })
    },

    changePage (page) {
      this.page = page
      this.fetchUsers()
    },

    onClickCreateUserBtn () {
      this.isModalVisible = true
    },

    onSubmitForm () {
      this.$refs.userForm.validate(valid => {
        if (!valid) return

        if (this.isCreate) {
          this.createUser()
        } else {
          this.updateContact()
        }
      })
    },

    createUser () {
      createUser(this.userForm).then(res => {
        this.$Message.success('创建成功')
        this.fetchUsers()
        this.hideModal()
      })
    },

    hideModal () {
      this.isModalVisible = false
      this.userForm = {}
    },

    updateContact () {

    }
  }
}
</script>
