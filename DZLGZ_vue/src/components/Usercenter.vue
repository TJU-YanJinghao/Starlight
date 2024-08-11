<template>
  <div class="page">
    <div class="home-link">
      <router-link to="/" class="font link">《首页</router-link>
    </div>
    <span class="horizontal-text">用户中心</span>
    <div class="background-image"></div>
    <div class="content">
      <div class="sidebar">
        <ul>
          <li><a @click="showSection('comments')">个人信息</a></li>
          <li><a @click="showSection('changePassword')">修改密码</a></li>
          <li><a @click="showSection('changePassword')">登出</a></li>
        </ul>
      </div>
      <div class="main">
        <div v-show="currentSection === 'comments'" class="section">
          <h2>昵称：Star</h2>
          <p style="font-size: 25px;" v-if="comments.length === 0">性别：男 年龄：9岁 </p>
          <p style="font-size: 25px;margin-bottom: 50px;" v-if="comments.length === 0">姓名：马小 年级：小学五年级 </p>
          <p style="font-size: 25px;" v-if="comments.length === 0">喜欢的形象：</p>
          <p style="font-size: 25px;margin-bottom: 50px;" v-if="comments.length === 0">小浣熊为主体，毛色为橙色，穿着蓝色的帽衫，戴着蓝色的帽子。 </p>
          <p style="font-size: 25px;" v-if="comments.length === 0">默认场景：</p>
          <p style="font-size: 25px;margin-bottom: 50px;" v-if="comments.length === 0">下雨的儿童游乐场。 </p>
          <p style="font-size: 25px;" v-if="comments.length === 0">默认情节：</p>
          <p style="font-size: 25px;" v-if="comments.length === 0">孩子和同学王明约好了周末一起去游乐场玩，但是周末突然下了暴雨，无法再去游乐场。 </p>
          <img src="../../../UI/head.jpg" alt="Profile Image" style="width: 200px; height: 200px; border-radius: 50%; position: absolute; top: 50px; right: 50px;">
           <ul class="comments-list">
                  <li v-for="comment in comments" :key="comment.id" class="comment-item">
                    <p class="comment-text">{{ comment.content }}</p>
                    <div class="comment-footer">
                      <span class="comment-date">时间: {{ new Date(comment.create_time).toLocaleString() }}</span>
                      <span class="comment-likes">点赞: {{ comment.likes }}</span>
                    </div>
                  </li>
              </ul>
        </div>
        <div v-show="currentSection === 'changePassword'" class="section">
          <h2>修改密码</h2>
          <form @submit.prevent="changePassword">
            <label class="form-label" for="oldPassword">旧密码：</label>
            <input type="password" v-model="oldPassword" id="oldPassword"><br>
            <label class="form-label" for="newPassword">新密码：</label>
            <input type="password" v-model="newPassword" id="newPassword"><br>
            <label class="form-label" for="confirmPassword">确认新密码：</label>
            <input type="password" v-model="confirmPassword" id="confirmPassword"><br>
            <button class="form-label" type="submit">提交</button>
          </form>
        </div>
        <div v-show="currentSection === 'feedback'" class="section">
          <h2>使用反馈</h2>
          <form @submit.prevent="sendFeedback">
            <label class="form-label" for="rating">评价：</label>
            <select v-model="rating" id="rating">
              <option value="1">1 分</option>
              <option value="2">2 分</option>
              <option value="3">3 分</option>
              <option value="4">4 分</option>
              <option value="5">5 分</option>
            </select><br>
            <label class="form-label" for="feedbackType">反馈类型：</label>
            <select v-model="feedbackType" id="feedbackType">
              <option value="建议">建议</option>
              <option value="错误反馈">错误反馈</option>
              <option value="咨询">咨询</option>
              <option value="其他">其他</option>
            </select><br>
            <label class="form-label" for="feedbackContent">反馈内容：</label>
            <textarea v-model="feedbackContent" id="feedbackContent"></textarea><br>
            <label class="form-label" for="contact">联系方式：</label>
            <input type="text" v-model="contact" id="contact"><br>
            <button class="form-label" type="submit">发送反馈</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      currentSection: 'comments',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      rating: '',
      feedbackType: '',
      feedbackContent: '',
      contact: '',
      user: JSON.parse(localStorage.getItem('user')) || null,
      comments: [],
    };
  },
  created() {
    this.fetchComments();
  },
  methods: {
    async fetchComments() {
      if (!this.user) {
        this.$router.push('/login');
        return;
      }
      try {
        const response = await axios.get('http://localhost:5000/api/usercenter/usercomments');
        this.comments = response.data;
        console.log(this.comments);
      } catch (error) {
        console.error(error);
      }
    },
    async logout() {
      try {
        const response = await axios.get('http://localhost:5000/api/logout');
        if (response.status === 200) {
          localStorage.removeItem('user');
          this.user = null;
          this.$router.push('/');
          alert('您已登出');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$router.push({ path: '/login' });
        }
        else{
          console.error(error);
          alert('Bad Request');
        }
      }
    },
    showSection(section) {
      this.currentSection = section;
    },
    async changePassword() {
      if(this.oldPassword ===''||this.newPassword ===''||this.confirmPassword ===''){
        alert('所有位置不能为空');
        return;
      }
      if(this.oldPassword ===this.newPassword){
        alert('新密码不能与旧密码相同');
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        alert('新密码和确认新密码不一致');
        return;
      }
      try {
        const response = await axios.post('http://localhost:5000/api/usercenter/updatePwd', {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        });
        if (response.status === 200) {
          alert('密码修改成功');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error(error);
            alert('Password change failed');
          }
        else{
          console.error(error);
          alert('Password change failed');
        }
      }
    },
    async sendFeedback() {
      try {
        const response = await axios.post('http://localhost:5000/api/usercenter/feedback', {
          rating: this.rating,
          feedback_type: this.feedbackType,
          feedback_content: this.feedbackContent,
          contact: this.contact
        });
        if (response.status === 200) {
          alert('反馈发送成功');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$router.push({ path: '/login' });
        }
        else{
          console.error(error);
          alert('Feedback sending failed');
        }
      }
    }
  }
};
</script>


<style scoped>
/* Reset styles */
body {
  margin: 0;
  height: 100%;
  padding: 0;
  font-family: "hongleixingshu",-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    "Microsoft Yahei", sans-serif;
  background: #f5f5f5;
}

/* 确保所有子元素的box-sizing为border-box，防止元素超出容器 */
body * {
  box-sizing: border-box;
  flex-shrink: 0;
}

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

.page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: transparent;
  overflow-x: hidden;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  width: 80%;
  min-height: 80vh;
  color: #333;
  text-align: left;
  margin-top: 10vh; /* 向下移动 10vh */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.85);
  border-radius: 10px;
  overflow: hidden;
}

.sidebar {
  width: 20%;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.05);
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  font-size: 25px;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  margin-bottom: 1em;
}

.sidebar a {
  text-decoration: none;
  color: #333;
  display: block;
  padding: 0.75em;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  transition: background-color 0.3s, color 0.3s;
  background: #f9f9f9;
}

.sidebar a:hover {
  background-color: #e9e9e9;
}

.logout-link {
  color:red;
}
.sidebar button {
  width: 100%;
  padding: 0.75em;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  color: #333;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s, color 0.3s;
}

.sidebar button:hover {
  background-color: #e9e9e9;
}

.main {
  flex-grow: 1;
  padding: 2rem;
}

.section {
  display: block;
}

.section h2 {
  margin-top: 0;
  margin-bottom: 0;
  font-size: 30px;
  color: #333;
}


form {
  display: flex;
  flex-direction: column;
}

form label {
  margin-top: 1em;
  font-size: 20px;
  font-weight: bold;
}

.form-label {
    margin-top: 1em;
    font-size: 20px;
    font-family: "hongleixingshu";
    font-size: 25px;
}

form input, form textarea, form select {
  margin-top: 0.5em;
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
}

form button {
  margin-top: 1em;
  padding: 0.5em;
  border: none;
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

form button:hover {
  background-color: #45a049;
}

/* 添加首页链接的样式 */
.home-link {
  position: absolute;
  top: 2rem;
  left: 3rem;
}

.home-link .link {
  color: #ffffff; /* 颜色使用白色 */
  font-size: 3rem; /* 增大字体大小 */
  font-family: "hongleixingshu"; /* 使用"hongleixingshu"字体 */
  text-decoration: none;
}

.home-link .link:hover {
  text-decoration: underline;
}

.horizontal-text {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  writing-mode: horizontal-lr;
  font-size: 4.3rem;
  font-family: "hongleixingshu";
  text-shadow: 0.31rem 0.44rem 0.31rem #1e1008a3;
  color: #ffffff;
  line-height: 3.3rem;
  margin-left: 1rem;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.comments-section {
    padding: 1rem;
}


.comments-list {
  max-height: 700px; /* 固定高度 */
  overflow-y: auto; /* 添加滚动条 */
  padding: 0;
  margin: 0;
  list-style: none;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.comment-item {
    background: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 1rem;
    padding: 1rem;
    transition: background-color 0.3s;
}

.comment-item:hover {
    background-color: #f0f0f0;
}

.comment-text {
    margin: 0;
    font-size: 1rem;
    color: #000000;
    line-height: 1.5;
    word-wrap: break-word; /* 强制换行 */
}

.comment-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: #555;
}


</style>