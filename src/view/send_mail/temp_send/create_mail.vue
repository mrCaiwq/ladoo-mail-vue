<template>
  <div>
    <Form ref="emailForm" :model="formItem" :rules="rules" :label-width="80">
      <FormItem label="收件人" prop="recipients">
        <input-tag v-model="formItem.recipients" :allow-duplicates="true" placeholder="请输入收件人邮箱"/>
      </FormItem>

      <div class="group-and-btn">
        <FormItem class="group-wrapper" label="联系人分组">{{ groupNames }}</FormItem>

        <div class="add-contact">
          <Upload action :before-upload="beforeUpload">
            <Button icon="ios-cloud-upload-outline">上传收件人</Button>
          </Upload>
          <Button
            class="select-contact"
            size="small"
            icon="ios-add-circle-outline"
            @click="onClickSelectContact"
          >选择收件人</Button>
        </div>
      </div>

      <FormItem label="发件人" prop="sender">
        <Input v-model="formItem.sender" placeholder="请输入发件人邮箱"/>
      </FormItem>
      <FormItem label="标题" prop="subject">
        <Input v-model="formItem.subject" placeholder="请输入标题"/>
      </FormItem>
      <FormItem prop="content">
        <editor ref="editor" v-model="formItem.content"/>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit">提交</Button>
        <Button @click="handleReset('formValidate')" style="margin-left: 8px">清空</Button>
      </FormItem>
    </Form>

    <SelectContactModal v-model="isContactModalVisible" @on-submit-selection="onSubmitSelection"/>
  </div>
</template>

<script>
import Editor from '@c/editor'
import SelectContactModal from '../select_contact'
import { batchCreate } from '@/api/email'
import { getArrayFromFile, getTableDataFromArray } from '@/libs/util'
import InputTag from 'vue-input-tag'
import _ from 'lodash'

export default {
  name: 'editor_page',
  components: {
    Editor,
    InputTag,
    SelectContactModal
  },
  data () {
    return {
      formItem: {
        recipients: ['hjiangwen1@163.com'],
        sender: 'hjiangwen1@163.com',
        content: `In working with other << INSERT INDUSTRY OR POSITION >>, one of the key issues they’re struggling with is << INSERT KEY ISSUE >>.`,
        subject: 'Cold Prospecting Email Templates',
        group_ids: []
      },
      rules: {
        sender: [
          { required: true, message: '发件人不能为空', trigger: 'blur' },
          { type: 'email', message: '邮件格式不正确', trigger: 'blur' }
        ],
        subject: { required: true, message: '标题不能为空', trigger: 'blur' },
        recipients: {
          type: 'array',
          required: true,
          min: 1,
          message: '收件人不能为空',
          trigger: 'change'
        },
        content: { required: true, message: '内容不能为空', trigger: 'blur' }
      },
      isContactModalVisible: false,
      groups: []
    }
  },

  computed: {
    groupNames () {
      return this.groups.map(group => group.name).join(', ')
    }
  },
  methods: {
    onClickSelectContact () {
      this.isContactModalVisible = true
    },
    handleSubmit () {
      this.$refs['emailForm'].validate(valid => {
        if (!valid) {
          this.$Message.error('请正确地填写邮件')
        } else {
          this.createEmail()
        }
      })
    },

    createEmail () {
      batchCreate(this.formItem).then(res => {
        this.$Message.success('成功发送邮件')
      })
    },

    beforeUpload (file) {
      getArrayFromFile(file)
        .then(data => {
          let { tableData } = getTableDataFromArray(data)
          tableData.forEach(row => {
            if (row.recipients) {
              this.formItem.recipients.push(row.recipients)
            }
          })
        })
        .catch(() => {
          this.$Notice.warning('只能上传CSV文件')
        })
      return false
    },

    handleReset () {
      this.formItem = {
        recipients: [],
        sender: '',
        content: '',
        subject: '',
        group_ids: []
      }
    },

    onSubmitSelection (groups, contactEmails) {
      this.groups = _.unionBy(this.groups, groups, 'id')
      let groupIds = groups.map(group => group.id)
      this.formItem.group_ids = _.union(this.formItem.group_ids, groupIds)
      this.formItem.recipients = _.union(this.formItem.recipients, contactEmails)
    }
  }
}
</script>

<style scoped>
#email-input {
  max-width: none;
}
.add-contact {
  display: flex;
  justify-content: flex-end;
}
.select-contact {
  margin-left: 6px;
  height: 31.9px;
}

.group-and-btn {
  display: flex;
}

.group-and-btn .group-wrapper {
  flex-grow: 1;
}
</style>
