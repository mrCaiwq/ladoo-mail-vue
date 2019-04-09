<template>
  <div>
    <Form :model="formItem" :label-width="80">
      <FormItem label="收件人">
        <Input v-model="recipients" placeholder="请输入收件人邮箱" size="medium"/>
      </FormItem>
      <FormItem>
        <Button type="secondary" @click="handleSubmit('formValidate')">上传</Button>
      </FormItem>
      <FormItem label="发件人">
        <Input v-model="sender" placeholder="请输入发件人邮箱" size="medium"/>
      </FormItem>
      <FormItem label="标题">
        <Input v-model="subject" placeholder="请输入标题" size="medium"/>
      </FormItem>
      <FormItem label>
        <editor ref="editor" :value="formItem.content" @on-change="handleChange"/>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
        <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import Editor from "_c/editor";
export default {
  name: "editor_page",
  components: {
    Editor
  },
  data() {
    return {
      formItem: {
        recipients: "",
        sender: "",
        content: "",
        subject: ""
      }
    };
  },
  methods: {
    handleChange(html, text) {
      console.log(html, text);
    },
    changeContent() {
      this.$refs.editor.setHtml("<p>powered by wangeditor</p>");
    }
  }
};
</script>

<style>
</style>
