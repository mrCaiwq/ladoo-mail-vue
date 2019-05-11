<template>
  <div>
    <Modal v-model="visible" width="700" class="select-contact-modal">
      <p slot="header" class="modal-header">
        <span>选择联系人</span>
      </p>
      <div class="modal-body">
        <Input
          class="search-input"
          search
          enter-button
          placeholder="搜索"
          @on-search="onClickSearch"
          v-model="searchText"
        />
        <Row>
          <Col span="10">
            <p class="panel-title">分组</p>

            <div
              class="group-item"
              :class="{ active: group.id == currentGroupId }"
              v-for="group in groups"
              :key="group.id"
            >
              <Checkbox class="select-item" v-model="group.selected" size="large"/>
              <span class="group-name" @click="onClickGroupLabel(group.id)">{{ group.name }}</span>
            </div>
          </Col>

          <Col span="13">
            <p class="panel-title">
              <Checkbox
                :indeterminate="contactIndeterminate"
                :value="isSelectAllContact"
                @click.prevent.native="selectAllContact"
                size="large"
              />联系人
            </p>

            <Scroll :on-reach-bottom="handleReachBottom" height="400">

              <CheckboxGroup v-model="selectedContactIds" @on-change="onContactListChange">
                <Checkbox
                  class="select-item contact-item"
                  v-for="contact in contacts"
                  :key="contact.id"
                  :label="contact.id"
                  size="large"
                >
                  <span class="contact-item-label">{{ contact.email }}</span>
                </Checkbox>
              </CheckboxGroup>
            </Scroll>
          </Col>
        </Row>
      </div>

      <div slot="footer">
        <span class="counter-label">已选择 {{ selectedContactSize }} 联系人, {{ selectedGroupSize }} 分组</span>
        <Button type="primary" @click="submitSelection">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { searchContact, getContactList } from '@/api/contact'
import { getGroupList } from '@/api/group'
import _ from 'lodash'

const FETCH_BY_GROUP = 'group'
const FETCH_BY_SEARCH = 'search'

export default {
  name: 'SelectContactModal',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: false,
      searchText: null,
      contacts: [],
      groups: [],

      selectedContactIds: [],
      isSelectAllContact: false,
      contactIndeterminate: false,

      currentGroupId: null,
      page: 1,
      fetchContactType: null
    }
  },

  computed: {
    selectedContactSize () {
      return this.selectedContactIds.length
    },

    selectedGroupSize () {
      return this.selectedGroups.length
    },

    selectedGroups () {
      return this.groups.filter(group => group.selected)
    },

    selectedGroupIds () {
      return this.selectedGroups.map(group => group.id)
    },

    isFetchBySearch () {
      return this.fetchContactType === FETCH_BY_SEARCH
    },

    isFetchByGroup () {
      return this.fetchContactType === FETCH_BY_GROUP
    }

  },

  beforeMount () {
    getGroupList({ per_page: 1000 }).then(res => {
      this.groups = res.data.data

      if (this.groups.length > 0) {
        this.currentGroupId = this.groups[0].id
        this.page = 1
        this.fetchContactsByGroup()
      }
    })
  },

  watch: {
    visible (newValue, _) {
      this.$emit('input', newValue)
    },
    value (newValue) {
      this.visible = newValue
    }
  },

  methods: {
    getSelectedContacts () {
      return this.contacts.filter(contact => {
        return this.selectedContactIds.includes(contact.id)
      })
    },
    selectAllContact () {
      if (this.contactIndeterminate) {
        this.isSelectAllContact = false
      } else {
        this.isSelectAllContact = !this.isSelectAllContact
      }
      this.contactIndeterminate = false

      if (this.isSelectAllContact) {
        this.selectedContactIds = this.contacts.map(i => i.id)
      } else {
        this.selectedContactIds = []
      }
    },

    onContactListChange (data) {
      if (data.length === this.contacts.length) {
        this.contactIndeterminate = false
        this.isSelectAllContact = true
      } else if (data.length > 0) {
        this.contactIndeterminate = true
        this.isSelectAllContact = false
      } else {
        this.contactIndeterminate = false
        this.isSelectAllContact = false
      }
    },

    removeSelected () {
      this.selectedContactIds = []
      this.groups.forEach(group => {
        group.selected = false
      })
    },

    removeUnselectedContacts () {
      this.contacts = this.getSelectedContacts()
    },

    onClickSearch () {
      this.page = 1
      this.removeUnselectedContacts()
      this.searchContact()
    },

    searchContact () {
      this.fetchContactType = FETCH_BY_SEARCH
      return searchContact({ page: this.page, q: this.searchText }).then(
        res => {
          let contacts = res.data.data
          this.fillContacts(contacts)
        }
      )
    },

    onClickGroupLabel (id) {
      this.currentGroupId = id
      this.page = 1
      this.removeUnselectedContacts()
      this.fetchContactsByGroup()
    },

    fetchContactsByGroup () {
      this.fetchContactType = FETCH_BY_GROUP
      return getContactList({
        page: this.page,
        group_id: this.currentGroupId
      }).then(res => {
        this.fillContacts(res.data.data)
      })
    },

    fillContacts (contacts) {
      if (contacts.length <= 0) return

      if (this.page === 1) {
        this.contacts = _.unionBy(this.getSelectedContacts(), contacts, 'id')
      } else {
        this.contacts.push(...contacts)
      }
    },

    handleReachBottom () {
      this.page += 1
      if (this.isFetchBySearch) {
        return this.searchContact()
      } else {
        return this.fetchContactsByGroup()
      }
    },

    submitSelection () {
      let contactEmails = this.getSelectedContacts().map(contact => contact.email)
      this.$emit('on-submit-selection', this.selectedGroups, contactEmails)

      this.visible = false
      this.removeSelected()
    }
  }
}
</script>

<style lang="less" scoped>
.modal-body {
  height: 500px;
  overflow: scroll;
}
.search-input {
  margin-bottom: 14px;
}
.panel-title {
  color: @subsidiary-color;
  font-size: 14px;
  margin-bottom: 10px;
}
.select-item {
  font-size: 16px;
  line-height: 28px;
}
.contact-item {
  display: block;
}
.contact-item-label {
  margin-left: 4px;
}
.group-item {
  display: flex;
}
.group-name {
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  flex-grow: 1;
  padding-left: 4px;
}
.group-item.active .group-name {
  background: #2d8cf0;
  color: white;
  border-radius: 2px;
}
.group-name {
  cursor: pointer;
}

.counter-label {
  margin-right: 20px;
}
</style>
