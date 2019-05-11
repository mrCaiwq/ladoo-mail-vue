<template>
  <div>
    <div class="header">
      <p class="subject">{{ email.subject }}</p>
      <Row class="subcontent">
        <Col span="12">
          <p>发件人：{{ email.sender_name }} &lt;{{ email.sender_address }}&gt; </p>
          <p>时 间：{{ formatTime(email.created_at) }}</p>
          <p>收件人：{{ email.recipient_name }} &lt;{{ email.recipient_address }}&gt;</p>
        </Col>
        <Col span="12">
          <p>
            状态：
            <Tag :color="getStateTagColor(email.state)">{{ $t(`email.state.${email.state}`) }}</Tag>
          </p>
          <p v-if="email.fail_reason">发送失败原因：{{ email.fail_reason }}</p>
          <p>
            打开邮件时间：
            <span v-if="email.is_open">{{ formatTime(email.opened_at) }}</span>
            <span v-else>未打开</span>
          </p>
          <p>
            点击邮件时间：
            <span v-if="email.is_click">{{ formatTime(email.clicked_at) }}</span>
            <span v-else>未点击</span>
          </p>
          <p>
            订阅状态：
            <span v-if="email.is_subscribe">已订阅</span>
            <span v-else-if="email.is_unsubscribe">取消订阅</span>
            <span v-else>未订阅</span>
          </p>
          <p>收件人是否抱怨：{{ $t(String(email.is_complained)) }}</p>
        </Col>
      </Row>
    </div>

    <Divider/>

    <div class="main-content" v-html="email.content"></div>
  </div>
</template>

<script>
import { formatTime } from '@/libs/time'
import { getStateTagColor } from '@/libs/tag'
import { getEmail } from '@/api/email'

export default {
  data () {
    return {
      email: {}
    }
  },

  beforeMount () {
    this.getEmail()
  },

  methods: {
    formatTime,
    getStateTagColor,
    getEmail () {
      const id = this.$route.params.id
      getEmail(id).then(res => {
        this.email = res.data.data
      })
    }
  }
}
</script>

<style>
.subject {
  font-size: 22px;
  color: black;
}

.subcontent {
  font-size: 14px;
}

.main-content {
  background: white;
  padding: 0 10px 10px;
  border-radius: 10px;
}
</style>
