<template>
  <div>
    <Form ref="emailForm" :model="formItem" :rules="rules" :label-width="80">
      <FormItem label="收件人" prop="recipients">
        <input-tag
          v-model="formItem.recipients"
          :allow-duplicates="true"
          placeholder="请输入收件人邮箱"
          />
      </FormItem>
      <FormItem>
        <Upload action="" :before-upload="beforeUpload">
          <Button icon="ios-cloud-upload-outline">上传</Button>
        </Upload>
      </FormItem>
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
  </div>
</template>

<script>
import Editor from '@c/editor'
import { batchCreate } from '@/api/email'
import { getArrayFromFile, getTableDataFromArray } from '@/libs/util'
import InputTag from 'vue-input-tag'

export default {
  name: 'editor_page',
  components: {
    Editor,
    InputTag
  },
  data () {
    let recipient = 'admin@qq.com'
    return {
      formItem: {
        recipients: [recipient],
        sender: 'admin@qq.com',
        content: `In working with other << INSERT INDUSTRY OR POSITION >>, one of the key issues they’re struggling with is << INSERT KEY ISSUE >>.

This past year we helped numerous companies to << INSERT BUSINESS DRIVER >>, resulting << MONEY SAVED, REVENUE ADDED, PRODUCTIVITY INCREASES >>.

If this is something you’re challenged with too, let’s set up a quick call. I have some ideas that might help.

All the best,
{CONTACT.OWNER_NAME}`,
        subject: 'Cold Prospecting Email Templates'
      },
      rules: {
        sender: [
          { required: true, message: '发件人不能为空', trigger: 'blur' },
          { type: 'email', message: '邮件格式不正确', trigger: 'blur' }
        ],
        subject: { required: true, message: '标题不能为空', trigger: 'blur' },
        recipients: { type: 'array', required: true, min: 1, message: '收件人不能为空', trigger: 'change' },
        content: { required: true, message: '内容不能为空', trigger: 'blur' }
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs['emailForm'].validate((valid) => {
        if (!valid) {
          this.$Message.error('请正确地填写邮件')
        } else {
          this.createEmail()
        }
      })
    },

    createEmail () {
      const { recipients, content, subject, sender } = this.formItem
      batchCreate({
        recipients,
        sender,
        content,
        subject
      })
        .then(res => {
          this.$Message.success('成功发送邮件')
        })
    },

    beforeUpload (file) {
      getArrayFromFile(file)
        .then(data => {
          let { tableData } = getTableDataFromArray(data)
          tableData.forEach(row => {
            if (row.recipients) {
              this.recipientTags.push(row.recipients)
            }
          })
        }).catch(() => {
          this.$Notice.warning('只能上传Csv文件')
        })
      return false
    },

    handleReset () {
      this.formItem = {
        recipients: [],
        sender: '',
        content: '',
        subject: ''
      }
    }
  }
}
</script>

<style>
#email-input {
  max-width: none
}
</style>
