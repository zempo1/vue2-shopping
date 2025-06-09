import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/merchant',
    children: [
      {
        path: 'merchant',
        name: 'Merchant',
        component: () => import('@/views/merchant/index'),
        meta: { title: '商家认证', icon: 'dashboard' }
      },
      {
        path: 'merchant/detail/:id',
        name: 'MerchantDetail',
        component: () => import('@/views/merchant/detail'),
        meta: { title: '商家详情' },
        hidden: true
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Goods',
        component: () => import('@/views/goods/index'),
        meta: { title: '商品审核', icon: 'el-icon-goods' }
      }
    ]
  },

  {
    path: '/goosCategory',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'GoodsCategory',
        component: () => import('@/views/goosCategory/index'),
        meta: { title: '商品分类', icon: 'el-icon-box' }
      }
    ]
  },

  {
    path: '/card',
    component: Layout,
    children: [
      {
        path: 'card',
        name: 'card',
        component: () => import('@/views/card/card'),
        meta: { title: '充值序列号', icon: 'el-icon-bank-card' }
      }
    ]
  },

  {
    path: '/orderManage',
    component: Layout,
    redirect: '/orderManage/order',
    name: 'orderManage',
    meta: { title: '订单管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/order/index'),
        meta: { title: '全部订单', icon: 'table' }
      },
      {
        path: 'status',
        name: 'Status',
        component: () => import('@/views/status/index'),
        meta: { title: '结清状态', icon: 'tree' }
      }
    ]
  },

  {
    path: '/userManage',
    component: Layout,
    redirect: '/userManage/user',
    name: 'userManage',
    meta: { title: '用户管理', icon: 'user' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/userManage/user'),
        meta: { title: '普通用户', icon: 'el-icon-s-custom' }
      },
      {
        //商家管理
        path: 'merchantManage',
        name: 'MerchantManage',
        component: () => import('@/views/userManage/merchantManage'),
        meta: { title: '商家管理', icon: 'el-icon-trophy' }
      },
    ]
  },

  {
    path: '/chart',
    component: Layout,
    children: [
      {
        path: 'chart',
        name: 'Chart',
        component: () => import('@/views/chart/chart'),
        meta: { title: '数据监控', icon: 'el-icon-data-line' }
      }
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
