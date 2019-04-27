<template>
  <div>
    <Form ref="emailForm" :model="formItem" :rules="rules" :label-width="80">
      <FormItem label="收件人" prop="recipients">
        <vue-tags-input
          id="email-input"
          v-model="tag"
          :tags="recipientTags"
          :validation="recipientValidation"
          placeholder="请输入收件人邮箱"
          @tags-changed="handleTagChange"
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
        <editor ref="editor" :value="formItem.content" @on-change="handleChange"/>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit">Submit</Button>
        <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import Editor from '_c/editor'
import { batchCreate } from '@/api/email'
import { getArrayFromFile, getTableDataFromArray } from '@/libs/util'
import VueTagsInput from '@johmun/vue-tags-input'

export default {
  name: 'editor_page',
  components: {
    Editor,
    VueTagsInput
  },
  data () {
    return {
      formItem: {
        recipients: null,
        sender: '',
        content: '',
        subject: ''
      },
      tag: '',
      recipientTags: [],
      rules: {
        sender: [
          { required: true, message: '发件人不能为空', trigger: 'change' },
          { type: 'email', message: '邮件格式不正确', trigger: 'change' }
        ],
        subject: { required: true, message: '标题不能为空', trigger: 'change' },
        content: { required: true, message: '内容不能为空', trigger: 'change' },
        recipients: { type: 'array', required: true, min: 1, message: '收件人不能为空', trigger: 'change' }
      },
      recipientValidation: [
        {
          classes: 'invalid-email',
          rule: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        }
      ]
    }
  },
  methods: {
    handleTagChange (newTags) {
      this.recipientTags = newTags
      this.formItem.recipients = newTags.map(tag => tag.text)
    },

    handleChange (html, text) {
      this.formItem.content = text ? html : null
    },

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
    }
  }
}
</script>

<style>
#email-input {
  max-width: none
}
</style>
