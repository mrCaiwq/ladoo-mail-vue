import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: 'home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },

  {
    path: '/message',
    name: 'message',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'message_page',
        name: 'message_page',
        meta: {
          icon: 'md-notifications',
          title: '消息中心'
        },
        component: () => import('@/view/single-page/message/index.vue')
      }
    ]
  },
  {
    path: '/send_mail',
    name: 'send_mail',
    meta: {
      icon: 'logo-buffer',
      title: '邮件'
    },
    component: Main,
    children: [
      {
        path: 'send_mail',
        name: 'send_mail_page',
        meta: {
          icon: 'md-arrow-dropdown-circle',
          title: '群发'
        },
        component: () => import('@/view/send_mail/create_mail.vue')
      },
      {
        path: 'mails',
        name: 'mails',
        meta: {
          icon: 'md-arrow-dropdown-circle',
          title: '查看邮件'
        },
        component: () => import('@/view/send_mail/mail_list.vue')
      },
      {
        path: 'mail_detail/:id',
        name: 'mail_detail',
        meta: {
          hideInMenu: true,
          icon: 'md-arrow-dropdown-circle',
          title: '邮件详情'
        },
        component: () => import('@/view/send_mail/mail_detail.vue')
      },
      {
        path: 'batch_emails',
        name: 'batch_email_stat',
        component: () => import('@/view/send_mail/batch_email_list.vue'),
        meta: {
          icon: 'md-arrow-dropdown-circle',
          title: '群发统计'
        }
      }
    ]
  },

  {
    path: '/contacts',
    name: 'contacts',
    meta: {
      icon: 'logo-buffer',
      title: '联系人'
    },
    component: Main,
    children: [
      {
        path: '/contacts',
        name: 'contacts_list',
        component: () => import('@/view/contacts/contact_list.vue'),
        meta: {
          icon: 'md-arrow-dropdown-circle',
          title: '联系人'
        }
      },
      {
        path: 'contacts_group',
        name: 'contact_group',
        component: () => import('@/view/groups/groups_list.vue'),
        meta: {
          icon: 'md-arrow-dropdown-circle',
          title: '联系人分组'
        }
      }
    ]
  },

  {
    path: '/users',
    name: 'users',
    meta: {
      icon: 'logo-buffer',
      title: '人员管理'
    },
    component: Main,
    children: [
      {
        path: '/users',
        name: 'user_list',
        meta: {
          icon: 'md-arrow-dropdown-circle',
          title: '人员管理'
        },
        component: () => import('@/view/users/user_list.vue')
      }
    ]
  },

  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
