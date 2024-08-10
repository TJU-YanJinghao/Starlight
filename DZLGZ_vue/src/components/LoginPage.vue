<template>
  <div class="login-page">
    <!-- 添加跳转回首页的选项 -->
    <div class="home-link">
      <router-link to="/" class="font link">《首页</router-link>
    </div>
    <div class="background-image"></div>
    <div class="login-container">
      <h2>登录</h2>
      <form @submit.prevent="login">
        <div class="input-group">
          <label v-if="accountLabelVisible" for="account">账号</label>
          <input type="text" id="account" name="account" v-model="account" @focus="hideLabel('account')" @blur="showLabel('account')" />
        </div>
        <div class="input-group">
          <label v-if="passwordLabelVisible" for="password">密码</label>
          <input type="password" id="password" name="password" v-model="password" @focus="hideLabel('password')" @blur="showLabel('password')" />
        </div>
        <button type="submit" class="login-button">立即登录</button>
      </form>
      <div class="register-link">
        <span>没有账号？</span>
        <router-link to="/register" class="font link">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  components: {},
  props: {},
  name: "Login",
  data() {
    return {
      account: '',
      password: '',
      accountLabelVisible: true,
      passwordLabelVisible: true,
    };
  },
  methods: {
    hideLabel(field) {
      this[`${field}LabelVisible`] = false;
    },
    showLabel(field) {
      if (!this[field]) {
        this[`${field}LabelVisible`] = true;
      }
    },
    async login() {
      const user = { account: this.account };
      localStorage.setItem('user', JSON.stringify(user));
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
/* 页面样式 */
.login-page {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  overflow: hidden;
}

/* 添加首页链接的样式 */
.home-link {
  position: absolute;
  top: 2rem;
  left: 3rem;
}

.home-link .link {
  color: #ffffff; /* 颜色使用白色 */
  font-size: 2rem; /* 增大字体大小 */
  font-family: "hongleixingshu"; /* 使用"hongleixingshu"字体 */
  text-decoration: none;
}

.home-link .link:hover {
  text-decoration: underline;
}

/* 背景图样式 */
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("../../static/background.png");
  background-size: cover;
  background-position: bottom;
  filter: blur(1.5px);
  z-index: -1;
}

/* 登录容器样式 */
.login-container {
  position: relative;
  width: 350px;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); /* 更明显的悬空阴影效果 */
  border-radius: 0; /* 边界改为直角 */
  text-align: center;
  background-image: url("../../static/green.png"); /* 背景纸纹理 */
  background-size: cover;
  border: none; /* 取消边框 */
}

/* 登录标题样式 */
.login-container h2 {
  font-family: "hongleixingshu"; /* 字体 */
  font-size: 3rem;
  color: #5b4636; /* 字体颜色 */
  font-weight: 550; /* 调整字体粗细 */
  margin-bottom: 1rem;
}

.input-group {
  margin-bottom: 2rem; /* 增加输入框之间的距离 */
  position: relative;
  background: url("../../static/03-账号密码框.png") no-repeat center center; /* 确保背景图居中对齐 */
  background-size: contain; /* 确保背景图完整显示 */
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: flex-start; /* 左对齐 */
  align-items: center; /* 垂直居中对齐 */
  padding: 1.2rem 2rem; /* 添加内边距以确保输入框不贴边 */
}

label {
  font-size: 1.6rem;
  color: #5b4636; /* 字体颜色 */
  font-family: "hongleixingshu"; /* 字体 */
  position: absolute;
  top: 50%;
  left: 0.8rem; /* 调整左边距 */
  transform: translateY(-25%); /* 使标签垂直居中 */
  pointer-events: none; /* 使标签不可点击 */
  z-index: 1; /* 确保标签在输入框上层 */
}

input {
  width: 30rem; /* 设置具体宽度值来增加长度 */ /* 计算宽度以确保输入框适应容器 */
  border: none;
  padding: 1.2rem 2rem; /* 调整内边距 */
  font-size: 1.3rem;
  font-family: "hongleixingshu"; /* 字体 */
  background: transparent; /* 背景透明 */
  color: #5b4636; /* 字体颜色 */
  border-radius: 0; /* 边界改为直角 */
  z-index: 2; /* 确保输入框在标签上层 */
  padding-left: 2rem; /* 调整左侧内边距以确保输入文本与标签对齐 */
  transform: translate(-1.8rem, 0.5rem); /* 向左和向下调整位置 */
}

input:focus {
  outline: none; /* 去掉聚焦时的边框 */
}

/* 登录按钮样式 */
.login-button {
  width: 100%;
  padding: 1.75rem;
  background: url("../../static/03-立即登录框.png") no-repeat center;
  background-size: cover;
  color: #5b4636; /* 字体颜色 */
  border: none;
  border-radius: 0; /* 边界改为直角 */
  font-size: 2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: "hongleixingshu"; /* 字体 */
  font-weight: 400; /* 调整字体粗细 */
  margin-bottom: 1rem;
}

.login-button:hover {
  background-color: rgba(0, 0, 0, 0.1); /* 按钮悬停时略微变暗 */
}

/* 注册链接样式 */
.register-link {
  margin-top: 1rem;
  font-size: 0.9rem;
  font-family: "HYQiHei"; /* 修改字体为 "HYQiHei" */
}

.register-link a {
  color: #5b4636; /* 字体颜色 */
  text-decoration: none;
  font-weight: bold;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>