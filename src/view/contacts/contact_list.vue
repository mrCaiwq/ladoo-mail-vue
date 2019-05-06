<template>
  <div>
    <div class="filter-wrapper">
      <Button type="primary" @click="showContactModal">创建联系人</Button>
    </div>
    <Table :columns="contactColumns" :data="contacts">
      <template slot-scope="{ row }" slot="action">
        <Button
          type="primary"
          size="small"
          style="margin-right: 5px"
          @click="showUpdateModal(row)"
        >修改</Button>
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
        <span>创建联系人</span>
      </p>
      <Form ref="contactForm" :model="contactForm" :rules="ruleCustom" :label-width="80">
        <FormItem label="邮箱地址" prop="email">
          <Input type="text" v-model="contactForm.email"/>
        </FormItem>
        <FormItem label="分组" prop="group_id">
          <Input type="text" v-model="contactForm.group_id"/>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input type="text" v-model="contactForm.name"/>
        </FormItem>
        <FormItem label="公司" prop="company">
          <Input type="text" v-model="contactForm.company"/>
        </FormItem>
        <FormItem label="描述" prop="description">
          <Input type="text" v-model="contactForm.description"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submitForm">创建</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getContactList,
  createContact,
  updateContact,
  deleteContact
} from '@/api/contact'

export default {
  name: 'ContactList',
  data () {
    return {
      visibleModal: false,
      contactColumns: [
        {
          title: '编号',
          key: 'id'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '分组',
          key: 'group_id'
        },
        {
          title: '描述',
          key: 'description'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      contacts: [],
      page: 1,
      total: 10,
      perPage: 30,
      contactForm: {
        id: null,
        email: '',
        group_id: null,
        company: null,
        name: null,
        description: null
      },
      ruleCustom: {
        email: { required: true, message: '邮箱不能为空', trigger: 'blur' },
        group_id: { required: true, message: '分组不能为空', trigger: 'blur' }
      }
    }
  },

  beforeMount () {
    this.fetchContacts()
  },

  methods: {
    showContactModal () {
      this.visibleModal = true
    },

    fetchContacts () {
      let param = {
        page: this.page,
        per_page: this.perPage
      }
      getContactList(param).then(res => {
        let { data, meta } = res.data
        this.contacts = data
        this.total = meta.total_count
      })
    },

    changePage (page) {
      this.page = page
      this.fetchContacts()
    },

    submitForm () {
      this.$refs['contactForm'].validate(valid => {
        if (!valid) return

        if (this.contactForm.id) {
          this.updateContact()
        } else {
          this.createContact()
        }
      })
    },

    createContact () {
      createContact(this.contactForm).then(res => {
        this.$Message.success('创建成功')
        this.visibleModal = false
        this.fetchContacts()
      })
    },

    updateContact () {
      updateContact(this.contactForm).then(res => {
        this.$Message.success('修改成功')
        this.visibleModal = false
        this.fetchContacts()
      })
    },

    showUpdateModal (contact) {
      this.contactForm = Object.assign({}, contact)
      this.visibleModal = true
    },

    remove (contact) {
      this.$Modal.confirm({
        loading: true,
        title: '确认要删除该联系人吗？',
        onOk: () => {
          deleteContact(contact.id).then(res => {
            this.fetchContacts()
            this.$Message.success('删除成功')
            this.$Modal.remove()
          })
        }
      })
    }
  }
}
</script>
