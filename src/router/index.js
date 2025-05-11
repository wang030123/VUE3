import { createRouter, createWebHistory } from 'vue-router'

//导入组件
import LoginVue from '@/views/Login.vue'
import RegisterVue from '@/views/Register.vue'
import LayoutVue from '@/views/Layout.vue'

import ArticleCategoryVue from '@/views/article/ArticleCategory.vue'
import ArticleManageVue from '@/views/article/ArticleManage.vue'
import UserAvatarVue from '@/views/user/UserAvatar.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue'
import UserForgetPasswordVue from '@/views/forgetPassword.vue'
import UserVue from '@/views/user/User.vue'
import MyStarVue from '@/views/MyStar.vue'

//定义路由关系
const routes = [
    { path: '/login', component: LoginVue },
    { path: '/user/register', component: RegisterVue },
    { path: '/user/forgetPassword', component: UserForgetPasswordVue },
    {
        path: '/', component: LayoutVue,redirect:'/article/manage', children: [
            { path: '/article/mystar', component: MyStarVue },
            { path: '/article/category', component: ArticleCategoryVue },
            { path: '/article/manage', component: ArticleManageVue },
            { path: '/user/info', component: UserInfoVue },
            { path: '/user/avatar', component: UserAvatarVue },
            { path: '/user/resetPassword', component: UserResetPasswordVue },
            { path: '/user/AllUser', component: UserVue }
        ]
    }
]

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

//导出路由
export default router
