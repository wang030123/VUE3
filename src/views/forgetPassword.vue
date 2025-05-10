<script setup>
import { User, Lock, Comment, Message, CreditCard, Right } from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

//定义数据模型
const PasswordData = ref({
    new_pwd: '',
    re_pwd: '',
    email: '',
    code: '',
    username: ''
})

//定义表单校验规则
const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur' }
    ],
    email: [
        { required: true, message: "请输入邮箱", trigger: "blur" }
    ],
    old_pwd: [
        { required: true, message: '请输入原密码', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur' }
    ],
    new_pwd: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur' }
    ],
    re_pwd: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur' }
    ],
}

//调用后台接口,完成注册
import { userPasswordForgetService, userGetEmailCodeService } from '@/api/user.js'
const forgetPassword = async () => {
    let result = await userPasswordForgetService(PasswordData.value);
    ElMessage.success(result.message ? result.message : '修改成功')
    router.push('/login')
}

//绑定数据,复用注册表单的数据模型
//表单数据校验
//登录函数
import { useRouter } from 'vue-router'
const router = useRouter()
const Backlogin = () => {
    //跳转到首页 路由完成跳转
    router.push('/login')
}


const btnDisabled = ref(false)
const second = ref(null)
const timer = ref(null)
const Countdown = computed(() => btnDisabled.value ? `重新获取 ( ${second.value} ) s` : '获取验证码')
const getCode = () => {
    let s = 60;
    if (!timer.value) {
        second.value = s;
        btnDisabled.value = true;

        timer.value = setInterval(() => {
            if (second.value > 0) {
                second.value--;
            } else {
                btnDisabled.value = false;
                clearInterval(timer.value);
                timer.value = null;
            }
        }, 1000);
    }
}
const handleClick = async () => {
    if (btnDisabled.value) return;

    try {
        // 先调用接口
        await getemailCode();
        // 接口成功后再启动倒计时
        getCode();
    } catch (error) {
        ElMessage.error('验证码发送失败');
    }
}

const getemailCode = async () => {
    const result = await userGetEmailCodeService(PasswordData.value);
    ElMessage.success(result.message || '验证码已发送');
}
</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" :model="PasswordData" :rules="rules">
                <el-form-item>
                    <h1>找回密码</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="PasswordData.username"></el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input name="email" :prefix-icon="Message" placeholder="请输入邮箱"
                        v-model="PasswordData.email"></el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input name="code" :prefix-icon="Comment" placeholder="请输入验证码" v-model="PasswordData.code">
                        <template #append>
                            <el-button class="custom-code-btn" :disabled="btnDisabled" @click="handleClick">
                                {{ Countdown }}
                            </el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="new_pwd">
                    <el-input name="new_pwd" :prefix-icon="Lock" type="password" placeholder="请输入新密码"
                        v-model="PasswordData.new_pwd"></el-input>
                </el-form-item>
                <el-form-item prop="re_pwd">
                    <el-input name="re_pwd" :prefix-icon="Lock" type="password" placeholder="请确认新密码"
                        v-model="PasswordData.re_pwd"></el-input>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="forgetPassword">找回密码</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="Backlogin">
                        返回登录 →
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

    .custom-code-btn {
        background-color: #409EFF !important;
        color: white !important;
        border-color: #409EFF !important;
    }

    /* 禁用状态下的样式 */
    .custom-code-btn.is-disabled {
        background-color: #a0cfff !important;
        border-color: #a0cfff !important;
    }
}
</style>