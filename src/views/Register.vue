<script setup>
import { User, Lock,Message } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
//定义数据模型
const registerData = ref({
    username: '',
    password: '',
    email:'',
    nickname:''
})

//定义邮箱校验规则
const checkEmail = (rule, value, callback) => {
    const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (value === '') {
        callback(new Error("邮箱不可为空"))
    } else if (regEmail.test(value)) {
        return callback();
    }
    callback(new Error("请输入合法的邮箱"));
}
//定义表单校验规则
const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur' }
    ],
    nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' },
        { min: 1, max: 8, message: '长度为1~8位非空字符', trigger: 'blur' }
    ],
    email: [
        {required: true, message: '请输入邮箱', trigger: 'blur' },
        {validator:checkEmail,trigger:'blur'}
    ]
}

import {useRouter} from 'vue-router'
const router = useRouter()
//调用后台接口,完成注册
import { userRegisterService} from '@/api/user.js'
const register = async () => {
    let result = await userRegisterService(registerData.value);
    ElMessage.success(result.message ? result.message : '注册成功')
    router.push("/login")
}
const Backlogin = async () => {
    router.push("/login")
}


</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <el-form ref="form" size="large" autocomplete="off" :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="nickname">
                    <el-input :prefix-icon="User"  placeholder="请输入昵称"
                        v-model="registerData.nickname"></el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input :prefix-icon="Message" placeholder="请输入邮箱" v-model="registerData.email"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码"
                      v-model="registerData.password"></el-input>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button"
                    type="primary" 
                    auto-insert-space @click="register()"
                    >
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="Backlogin">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
            url('@/assets/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>