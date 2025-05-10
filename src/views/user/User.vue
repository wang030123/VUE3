<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'

import { ref } from 'vue'


//文章列表数据模型
const nickname = ref([
])
const email = ref([
])
const Users = ref([
])
const title = ref('')
const dialogVisible=ref(false)
//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数

const UserList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        nickname: nickname.value ? nickname.value : null,
        email: email.value ? email.value : null
    }
    let result = await userListService(params);
    total.value = result.data.total;
    Users.value = result.data.items;
}
UserList()

const onSizeChange = (size) => {
    pageSize.value = size
    UserList()
}

const onCurrentChange = (num) => {
    pageNum.value = num
    UserList()
}

import { userListService,userDeleteService,userInfoUpdateService,userRegisterService } from '@/api/user.js'


import '@vueup/vue-quill/dist/vue-quill.snow.css'
//添加表单数据模型
const UserModel = ref({
    id:'',
    email: '',
    nickname: '',
    username: '',
    role: ''
})

import {ElMessage} from 'element-plus'

const addUser = async ()=>{
    let result = await userRegisterService(UserModel.value);

    ElMessage.success(result.msg? result.msg:'修改成功');

    //让抽屉消失
    dialogVisible.value = false;

    //刷新当前列表
    UserList()
}

const updateUser = async ()=>{
    let result = await userInfoUpdateService(UserModel.value);

    ElMessage.success(result.msg? result.msg:'添加成功');

    //让抽屉消失
    dialogVisible.value = false;

    //刷新当前列表
    UserList()
}
const showDialog = (row) => {
    dialogVisible.value = true; 
    title.value = '编辑用户'
    UserModel.value.nickname = row.nickname;
    UserModel.value.email = row.email;
    UserModel.value.username = row.username;
    UserModel.value.role = row.role===1?'管理员':'普通用户';
    UserModel.value.id = row.id
}
import {ElMessageBox} from 'element-plus'
const deleteUser = (row) => {
    //提示用户  确认框

    ElMessageBox.confirm(
        '你确认要删除该用户嘛?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //调用接口
            let result = await userDeleteService(row.id);
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            //刷新列表
            UserList();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '用户取消了删除',
            })
        })
}
</script>
<template>
 <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>用户管理</span>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item class="search" label="用户昵称：">
                <el-input placeholder="请输入用户昵称" v-model="nickname">
                </el-input>
            </el-form-item>
            <el-form-item class="search" label="用户邮箱：">
                <el-input placeholder="请输入用户邮箱" v-model="email">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="UserList">搜索</el-button>
                <el-button @click="email = ''; nickname = ''">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="Users" style="width: 100%">
            <el-table-column label="用户账号" prop="username" width="400"></el-table-column>
            <el-table-column label="用户昵称" prop="nickname"></el-table-column>
            <el-table-column label="用户邮箱" prop="email"> </el-table-column>
            <el-table-column label="用户角色" prop="role"
            :formatter="(row, col, value) => value === 1 ? '管理员' : '普通用户'"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit"  circle plain type="primary" @click="showDialog(row)" ></el-button>
                    <el-button :icon="Delete" circle plain type="danger"  @click="deleteUser(row)" ></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="UserModel" label-width="100px" style="padding-right: 30px">
                <el-form-item label="用户账号" prop="username">
                    <el-input v-model="UserModel.username" :disabled="true"  minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="nickname">
                    <el-input v-model="UserModel.nickname" minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="用户邮箱" prop="email">
                    <el-input v-model="UserModel.email" minlength="1" maxlength="15"></el-input>
                </el-form-item>
                <el-form-item label="用户角色" prop="role">
                    <el-input v-model="UserModel.role" minlength="1" maxlength="15"></el-input>
                </el-form-item>
                <el-form-item label="用户Id" prop="id">
                    <el-input v-model="UserModel.id" :disabled="true"  minlength="1" maxlength="15"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="title == '添加用户' ? addUser() : updateUser()"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
    </el-card>
</template>
<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .search{
        width: 300px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>