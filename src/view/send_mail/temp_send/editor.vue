<template>
  <div>
    <Form :model="formItem" :label-width="80">
      <FormItem label="收件人">
        <vue-tags-input
          id="email-input"
          v-model="tag"
          :tags="recipientTags"
          placeholder="请输入收件人邮箱"
          @tags-changed="newTags => recipientTags = newTags"
        />
      </FormItem>
      <FormItem>
        <Upload action="" :before-upload="beforeUpload">
          <Button icon="ios-cloud-upload-outline">上传</Button>
        </Upload>
      </FormItem>
      <FormItem label="发件人">
        <Input v-model="formItem.sender" placeholder="请输入发件人邮箱"/>
      </FormItem>
      <FormItem label="标题">
        <Input v-model="formItem.subject" placeholder="请输入标题"/>
      </FormItem>
      <FormItem label>
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
        recipients: '',
        sender: '',
        content: '',
        subject: ''
      },
      tag: '',
      recipientTags: []
    }
  },
  methods: {
    handleChange (html, text) {
      console.log(html, text)
    },

    handleSubmit () {
      const { content, subject, sender } = this.formItem
      const recipients = this.recipientTags.map(tag => tag.text)
      this.$Loading.start()

      batchCreate({
        recipients,
        sender,
        content,
        subject
      }).then(res => {
        const data = res.data.data
        if (!data.success) {
          // 为什么 key 是 table
          const message = data.errors[0].table.message
          return this.$Message.error(message)
        }
        this.$Message.success('成功发送邮件')
      }).catch(() => this.$Message.error('请求失败'))
        .finally(() => this.$Loading.finish())
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
