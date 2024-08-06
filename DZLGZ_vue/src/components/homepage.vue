<template>
  <div class="page">
    <!-- 导航栏 -->
    <div class="navbar" v-if="showNavbar">
      <div class="navbar-container">
        <div class="nav-links">
          <router-link :to="getLink('/Emotional')" class="nav-link" @click="checkAuth('/Emotional')">情感训练</router-link>
          <router-link :to="getLink('/Behavioral')" class="nav-link" @click="checkAuth('/Behavioral')">行为训练</router-link>
          <router-link :to="getLink('/Comprehensive')" class="nav-link" @click="checkAuth('/Comprehensive')">综合训练</router-link>
          <router-link :to="getLink('/forum')" class="nav-link" @click="checkAuth('/forum')">云社区</router-link>
          <router-link v-if="!user" to="/login" class="nav-link">登录</router-link>
          <router-link v-if="user"  to="/usercenter" class="nav-link">用户中心</router-link>
        </div>
      </div>
    </div>

<!--     <div class="manual-login">
      <button @click="manualLogin">手动设置为已登录</button>
    </div> -->

    <!-- 背景图容器，使用CSS背景图 -->
    <div class="background-image"></div>
    <div class="content" v-if="!page1Visible">
      <!-- 标题容器，包含主标题 -->
      <div class="title-wrapper">
        <div class="title-container">
          <span class="font title line1">欢迎你！</span><br/>
          <span class="font title line2">来自星星的孩子</span>
        </div>
      </div>

      <!-- 描述区域，包含详细描述文本 -->
      <div class="description">
        <span class="description-text">
          你好！我是Starlight，我很高兴能够和你一起学习和探索情感世界。
          <br/>无论是开心、难过、还是生气，我们都可以一起找到适合的表达方式和解决方法。
          <br/>如果你准备好了，我们可以从一个简单的问题开始。请告诉我，今天你感觉怎么样？😊
        </span>
      </div>
      <!-- 引入箭头动画组件 -->
      <ArrowAnimation :onClick="handleArrowClick" />
    </div>

    <div class="page1" v-if="page1Visible">
      <!-- <div class="image-container">
        <img class="image_ren" src="../../static/0.png"/>
        <img class="image_ren" src="../../static/1.png"/>
        <img class="image_ren" src="../../static/2.png"/>
        <img class="image_ren" src="../../static/3.png"/>
      </div> -->
      <div class="text-container">
        <span class="self-center font_3 pos" style="animation-delay: 0s;">在温暖阳光的照耀下，</span>
        <span class="self-center font_3 pos" style="animation-delay: 1s;" >孩子们的笑容如花绽放，</span>
        <span class="self-center font_3 pos" style="animation-delay: 2s;" >我们牵着他们的手，</span>
        <span class="self-center font_3 pos" style="animation-delay: 3s;" >走过爱的每一段路程。</span>
        <span class="self-center font_3 pos" style="animation-delay: 4s;" >心与心的交汇，</span>
        <span class="self-center font_3 pos" style="animation-delay: 5s;" >让世界变得更美好，</span>
        <span class="self-center font_3 pos" style="animation-delay: 6s;" >沉默的星辰也能闪耀光芒。</span>
      </div>
      <!-- 页脚区域，包含开发团队信息 -->
      <div class="footer">
        <!-- 开发团队信息，每行独占一行 -->
        <span class="font_2">开发团队: 同济大学嘉景远征队</span>
        <span class="font_2">联系我们: 1215648314@qq.com</span>
      </div>
    </div>
  </div>
</template>


<script>
import ArrowAnimation from './ArrowAnimation.vue'; // 引入箭头动画组件

export default {
  name: "Homepage", // 组件名称
  components: {
    ArrowAnimation // 注册箭头动画组件
  },
  data() {
    return {
      user: null,
      page1Visible: false, // 用于控制page1的显示状态
      showNavbar: true // 用于控制导航栏的显示状态
    };
  },
  created() {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
    }
    window.addEventListener('wheel', this.handleScroll); // 监听鼠标滚轮事件
  },
  destroyed() {
    window.removeEventListener('wheel', this.handleScroll); // 移除监听
  },
  methods: {
    logout() {
      localStorage.removeItem('user');
      this.user = null;
      this.$router.push('/');
    },
    checkAuth(path) {
      if (!this.user) {
        this.$router.push('/login');
      } else {
        this.$router.push(path);
      }
    },
    getLink(path) {
      return this.user ? path : '/login';
    },
    manualLogin() {
      const mockUser = { name: "Test User" }; // 模拟用户信息
      localStorage.setItem('user', JSON.stringify(mockUser));
      this.user = mockUser;
      alert("已手动设置为已登录状态");
    },
    handleScroll(event) {
      if (event.deltaY > 0) {
        this.page1Visible = true; // 向下滚动，显示page1
        this.showNavbar = false; // 隐藏导航栏
      } else if (event.deltaY < 0) {
        this.page1Visible = false; // 向上滚动，隐藏page1
        this.showNavbar = true; // 显示导航栏
      }
    },
    handleArrowClick() {
      this.page1Visible = true; // 点击箭头，显示page1
      this.showNavbar = false; // 隐藏导航栏
    }
  }
}
</script>

<style scoped>
/* 手动登录按钮样式 */
.manual-login {
  position: fixed;
  top: 2%;
  right: 2%;
  z-index: 100; /* 确保按钮在其他元素之上 */
}

.manual-login button {
  padding: 1% 2%;
  font-size: 1rem;
  cursor: pointer;
}

/* 隐藏光标在这些元素上 */
div, span, p {
  caret-color: transparent; /* 隐藏插入符 */
}

/* 设置html字体大小 */
html {
  font-size: 16px;
}

/* 设置body的样式 */
body {
  margin: 0;
  height: 100%;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    "Microsoft Yahei", sans-serif; /* 设置字体族 */
}

/* 确保所有子元素的box-sizing为border-box，防止元素超出容器 */
body * {
  box-sizing: border-box;
  flex-shrink: 0; /* 防止元素缩小 */
}

/* 主页面样式 */
.page {
  position: relative;
  width: 100%;
  min-height: 100vh; /* 页面最小高度为视口高度 */
  background-color: transparent; /* 背景透明 */
  overflow-x: hidden; /* 隐藏横向溢出 */
  padding: 0; /* 确保没有内边距 */
  margin: 0; /* 确保没有外边距 */
}

/* 导航栏样式 */
.navbar {
  width: 100%;
  background-color: rgba(128, 128, 128, 0.6); /* 设置为略微透明的灰色 */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2% 0; /* 增大导航栏高度 */
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}

.navbar-container {
  width: 100%;
  max-width: 90%; /* 增大导航栏的宽度 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2%; /* 增大左右内边距 */
}

.nav-links {
  display: flex;
  gap: 10%; /* 增加选项之间的间距 */
  flex-grow: 1;
  justify-content: center; /* 使选项居中分布 */
}

.nav-link, .logout-button {
  color: white;
  text-decoration: none;
  font-size: 2.5rem; /* 增大字体大小 */
  transition: all 0.3s ease; /* 添加过渡效果 */
  cursor: pointer; /* 确保按钮样式 */
  background: none;
  border: none;
  font-family: inherit; /* 继承字体样式 */
  text-align: left;
}

.nav-link:hover, .logout-button:hover {
  transform: scale(1.2); /* 鼠标悬停时放大 */
  color: rgb(48, 124, 70); /* 鼠标悬停时变为深绿色 */
  text-shadow: 0.3rem 0.4rem 0.3rem #1e1008a3; /* 添加文本阴影 */
  transition: transform 0.2s ease, color 0.2s ease, text-shadow 0.2s ease; /* 添加过渡效果 */
}

/* 背景图样式 */
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("../../../UI/background.png");
  background-size: cover; /* 确保背景图保持比例 */
  background-position: bottom; /* 保留下半部分 */
  filter: blur(1.5px); /* 添加模糊效果 */
  z-index: -1; /* 设置为最底层 */
}

/* 内容主容器样式 */
.content {
  position: relative;
  z-index: 1; /* 设置内容在背景图上层 */
  display: flex;
  flex-direction: column; /* 垂直排列子元素 */
  align-items: center; /* 水平居中 */
  justify-content: center; /* 子元素之间均匀分布 */
  margin: 0; /* 确保没有外边距 */
  width: 100%;
  min-height: 100vh; /* 内容最小高度为视口高度 */
  color: #fff;
  text-align: center; /* 文本居中 */
}

.content.hidden {
  opacity: 0;
}

/* 标题容器样式 */
.title-wrapper {
  position: relative;
  width: 100%;
  height: 20%; /* 确保容器有足够的高度 */
  margin-bottom: 0%; /* 调整与描述之间的距离 */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5%; /* 添加 margin-top 以向下移动标题 */
  padding: 15% 0% 12% 0%; /* 调整顶部内边距以适应固定导航栏 */
}

.title-container {
  position: absolute;
  text-align: center;
  line-height: 0.9; /* 调整行高，减小两行之间的间距 */
}

/* 标题样式 */
.title {
  font-size: 6vw;
  font-family: "hongleixingshu";
  color: #ffffff;
  text-shadow: 0.4vw 0.5vw 0.4vw #1e1008a3; /* 添加文本阴影 */
  margin: 0; /* 移除可能的外边距 */
}

.line1 {
  display: inline-block;
  text-shadow: 0.4vw 0.5vw 0.4vw #1e1008a3; /* 添加文本阴影 */
  animation: move 20s infinite;
}

.line2 {
  display: inline-block;
  text-shadow: 0.4vw 0.5vw 0.4vw #1e1008a3; /* 添加文本阴影 */
  animation: movesmall 20s infinite;
}

/* 描述文本样式 */
.description {
  max-width: 80%;
  font-size: 1.4rem;
  line-height: 2rem;
  text-align: center;
  text-shadow: 0.15rem 0.25rem 0.15rem #1e1008a3; /* 添加文本阴影 */
}

/* 页脚样式 */
.footer {
  text-align: center;
  margin-top: 1%;
  margin-bottom: 1%; /* 调整底部外边距 */
  position: relative; /* 确保footer在最下方 */
  z-index: 1; /* 确保footer在其他元素之上 */
}

/* 公共字体样式 */
.font {
  font-family: "hongleixingshu";
}

/* 页脚文本样式，块级元素 */
.font_2 {
  display: block; /* 设置为块级元素以便每个项目独占一行 */
  font-size: 0.8rem;
  font-family: "HYQiHei";
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* 添加文本阴影 */
  margin: 0.2rem 0; /* 调整每行之间的间距 */
}

/* page1 样式 */
.page1 {
  position: relative;
  width: 100%;
  height: 102vh; /* 覆盖整个页面 */ 
  background: rgba(0, 0, 0, 0.75);
  overflow: hidden; /* 移除多余的滚动条 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; /* 确保内容和footer之间的间距 */
  padding: 0; /* 确保没有内边距 */
  margin: 0; /* 确保没有外边距 */
  animation: changeBackground 2s 7.5s forwards; /* 在固定时间后将背景色改为透明 */
}

.text-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 2%;
  margin-top: 2%; /* 调低位置 */
  animation: fadeIn 1s ease-in-out forwards;
  position: relative; /* 改为相对定位，避免绝对定位影响布局 */
  z-index: 3; /* 确保文字在图片和背景之上 */
  opacity: 0;
}

.font_3 {
  text-shadow: 0.15rem 0.25rem 0.15rem #1e1008a3; /* 添加文本阴影 */
  font-size: 6vh;
  font-family: "hongleixingshu";
  line-height: 9vh;
  color: #ffffff;
}

.self-center {
  align-self: center;
}

.pos {
  opacity: 0;
  animation: fadeIn 1s forwards;
  margin: 1% 0;
}

.image-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.image_ren {
  opacity: 0;
  z-index: 2;
  position: absolute;
  max-width: 30%; /* 确保图片不会太大 */
  height: auto;
}

.image_ren:nth-child(1) {
  top: 5%;
  left: 3%;
  animation:fadeInHold 1s 1s forwards, disappear 1.5s 7.5s forwards;
}

.image_ren:nth-child(2) {
  top: 15%;
  right: 13%;
  transform: scale(2.5);
  animation:fadeInHold 1s 2.5s forwards, disappear 1.5s 7.5s forwards;
}

.image_ren:nth-child(3) {
  bottom: 8%;
  left: 0%;
  transform: scale(1.0);
  animation:fadeInHold 1s 4s forwards, disappear 1.5s 7.5s forwards;
}

.image_ren:nth-child(4) {
  bottom: 10%;
  right: 3%;
  animation:fadeInHold 1s 5.5s forwards, disappear 1.5s 7.5s forwards;
}


/* 响应式设计，小屏幕上的调整 */
@media (max-width: 600px) {
  .title {
    font-size: 3rem;
  }

  .nav-link {
    font-size: 1.2rem; /* 在小屏幕上调整字体大小 */
  }

  .nav-links {
    gap: 2rem; /* 在小屏幕上调整间距 */
  }

  .description {
    font-size: 1rem;
  }

  .font_2 {
    font-size: 0.75rem;
  }
}

@keyframes changeBackground {
  from { background: rgba(0, 0, 0, 0.7); }
  to { background: rgba(0, 0, 0, 0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInHold {
  from { opacity: 0; }
  to  { opacity: 1; }
}

@keyframes disappear {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes move {
  0% { 
    transform: translate(0,0); 
    color:rgb(255, 255, 255);
    font-size: 10rem;
  }
  20% { 
    transform: translate(12px,0); 
    color:black;
    font-size: 9.5rem;
  }
  60% { 
    transform: translate(10px,-10px); 
    color:rgb(248, 200, 6);
    font-size: 11rem;
  }
  80% { 
    transform: translate(0,-9px); 
    color:rgb(0, 0, 0);
    font-size: 9.5rem;
  }
  100% { 
    transform: translate(0,0); 
    color:rgb(255, 255, 255);
    font-size: 10rem;
  }
}

@keyframes movesmall {
  0% { 
    transform: translate(0,0); 
    color:rgb(255, 255, 255);
    font-size: 8rem;
  }
  20% { 
    transform: translate(12px,0); 
    color:black;
    font-size: 8.5rem;
  }
  60% { 
    transform: translate(10px,-10px); 
    color:rgb(202, 168, 33);
    font-size: 7.5rem;
  }
  80% { 
    transform: translate(0,-9px); 
    color:rgb(0, 0, 0);
    font-size: 8.5rem;
  }
  100% { 
    transform: translate(0,0); 
    color:rgb(255, 255, 255);
    font-size: 8rem;
  }
}
</style>
