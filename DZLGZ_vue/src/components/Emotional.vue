<template>
  <div class="app">
    <!-- 背景图容器，使用CSS背景图 -->
    <div class="background-image"></div>
    <div class="home-link">
      <router-link to="/" class="font link">《首页</router-link>
    </div>
    <div v-if="showForm" class="container">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>姓名：</label>
          <input type="text" v-model="formData.name" />
        </div>
        <div class="form-group">
          <label>年龄：</label>
          <input type="number" v-model="formData.age" />
        </div>
        <div class="form-group">
          <label>性别：</label>
          <label><input type="radio" value="男" v-model="formData.gender" /> 男</label>
          <label><input type="radio" value="女" v-model="formData.gender" /> 女</label>
        </div>
        <div class="form-group">
          <label>身份：</label>
          <textarea v-model="formData.identity"></textarea>
        </div>
        <div class="form-group">
          <label>喜欢的形象：</label>
          <textarea v-model="formData.favoriteImage"></textarea>
        </div>
        <div class="form-group">
          <label>背景：</label>
          <textarea v-model="formData.background"></textarea>
        </div>
        <div class="form-group">
          <label>故事情节：</label>
          <textarea v-model="formData.story"></textarea>
        </div>
        <div class="form-group">
          <label>感受：</label>
          <textarea v-model="formData.emotional"></textarea>
        </div>
        <div class="button-group">
          <button type="button" @click="handleReset">默认</button>
          <button type="submit">确定</button>
        </div>
      </form>
    </div>
    <div v-else>
      <div class="input-container">
        <textarea
          v-model="text"
          placeholder="请在此处输入……"
          class="input-textarea"
          @keydown.enter="handleEnterKey"
        ></textarea>
        <button class="send-button" @click="handleClick">发送</button>
        <button class="emotion-analysis-button" @click="handleEmotionAnalysis">情感分析</button>
      </div>
      <div class="output-container" :style="{'background-image': 'url(' + backgroundUrl + ')'}">
        <div v-for="(message, index) in messages" :key="message.id" :ref="'message-' + index" :class="['message', message.type]">
          <img :src="message.avatar" alt="" class="message-avatar" :class="message.type === 'sent' ? 'avatar-right' : ''" />
          <div class="message-content">
            <div class="message-text" v-if="message.text">{{ message.text }}</div>
          </div>
        </div>
        <div class="loading-container">
        <div v-if="isLoading" class="loading-spinner"></div> <!-- 等待动画 -->
      </div>
      </div>
      <!-- 底部的三个圆形按钮 -->
      <div class="emotion-buttons" v-if="showEmotionButtons">
        <button class="image-button" v-for="(imgUrl, index) in emotionImages" :key="index" @click="handleEmotionButtonClick(`我认为情感应该是第${index+1}张图片的表达。请你作为情感导师，对我的判断做出评价。（正确答案是第一张图片）`)">
          <img :src="imgUrl" alt="Emotion Image" class="emotion-image"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showForm: true, // 控制页面显示
      formData: {
        name: '',
        age: '',
        gender: '',
        identity: '',
        favoriteImage: '',
        background: '',
        story: '',
        emotional: ''
      },
      text: '',
      messages: [],
      isLoading: false, // 控制等待动画显示
      backgroundUrl: '', // 对话框背景图像的URL
      modelAvatar: '',
      userAvatar: "/static/img/head.24e92ab.jpg", // 用户头像的URL
      id: 0,
      showEmotionButtons: false, // 控制情感分析的按钮显示
      emotionImages: [], // 存储大模型生成的三个情感图片的URL
      conversation_id: ''
    };
  },
  methods: {
    goHome() {
      this.$router.push({ name: 'homepage' });
    },
    handleReset() {
      this.formData = {
        name: '马小',
        age: '11',
        gender: '男',
        identity: '小学五年级的学生',
        favoriteImage: '以小浣熊为主体，毛色为橙色，穿着蓝色的帽衫，戴着蓝色的帽子',
        background: '发生在下雨的儿童游乐场',
        story: '孩子和同学王明约好了周末一起去游乐场玩，但是周末突然下了暴雨，无法再去游乐场。请你扮演王明的角色',
        emotional: '计划失败的失望和难过'
      };
      this.userAvatar = "/static/img/head.24e92ab.jpg";
      this.id = 0;
    },
    async handleSubmit() {
      console.log('Submitted data:', this.formData);
      this.showForm = false; // 切换到对话页面
      let buffer = `我是家长。孩子的姓名是${this.formData.name}，年龄是${this.formData.age}岁，${this.formData.gender}孩子，${this.formData.identity}。画图：喜欢的形象${this.formData.favoriteImage}。画图：背景${this.formData.background}。故事情节是：${this.formData.story}，让孩子从中感受${this.formData.emotional}。`;
      this.isLoading = true; // 显示等待动画

      const url = 'https://open.oppomobile.com/agentplatform/app_api/chat';
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 5MfWH1dNeBUdpBvQ'
      };
      const body = JSON.stringify({
        query: buffer,
        response_mode: 'streaming',
        conversation_id: '',
        user: '用户唯一标识',
        files: []
      });

      try {
        console.log('Sending request...'); // 调试信息
        const response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: body
        });

        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let resultText = '';
        let buffer = '';
        let img_urls = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          buffer += chunk;
        }

        let lines = buffer.split('\n');
        for (const line of lines) {
          if (line.trim().startsWith('data: ')) {
            const dataStr = line.trim().substring(6);
            if (dataStr !== 'ping') {
              try {
                const data = JSON.parse(dataStr);
                if (data.event === 'agent_message' && data.answer) {
                  resultText += data.answer;
                } else if (data.event === 'message_file' && data.url) {
                  img_urls.push(data.url);
                } else if (data.event === 'message_end') {
                  this.conversation_id = data.conversation_id;
                }
              } catch (e) {
                console.error('JSON解析错误：', e);
              }
            }
          }
        }

        this.backgroundUrl = img_urls[1];
        this.modelAvatar = img_urls[0];
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      } finally {
        this.isLoading = false; // 隐藏等待动画
      }
    },

    async handleClick(flag = 0) {
      if (this.text.trim() === '') return;
      if (flag === 0) {
        this.messages.push({ id: this.id++, text: this.text, type: 'sent', avatar: this.userAvatar });
    }
      this.isLoading = true; // 显示等待动画

      const url = 'https://open.oppomobile.com/agentplatform/app_api/chat';
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 5MfWH1dNeBUdpBvQ'
      };
      const body = JSON.stringify({
        query: (this.id === 1?'接下来，开始对话，请回复文字。我是儿童。':'') + this.text,
        response_mode: 'streaming',
        conversation_id: this.conversation_id,
        user: '用户唯一标识',
        files: []
      });

      this.text = '';

      try {
        console.log('Sending request...');
        const response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: body
        });

        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let resultText = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          buffer += chunk;
        }

        let lines = buffer.split('\n');
        for (const line of lines) {
          if (line.trim().startsWith('data: ')) {
            const dataStr = line.trim().substring(6);
            if (dataStr !== 'ping') {
              try {
                const data = JSON.parse(dataStr);
                if (data.event === 'agent_message' && data.answer) {
                  resultText += data.answer;
                } else if (data.event === 'message_file' && data.url) {
                  this.emotionImages.push(data.url);
                }
              } catch (e) {
                console.error('JSON解析错误：', e);
              }
            }
          }
        }
        if (flag !== 1){
          this.messages.push({ id: this.id++, text: resultText, type: 'received', avatar: this.modelAvatar });
        }
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      } finally {
        this.isLoading = false; // 隐藏等待动画
      }
    },

    async handleEmotionAnalysis() {
      this.text = '开始情感分析。列举一种在上述模拟事件对话中想要表达的情感。并且列举出两种与该情感截然相反的情感。用1.   2.   3.    格式列举，共3条就可。';
      this.handleClick(1);
      setTimeout(() => {
        this.text = '画三张图，分别表达上述三种情感。你只需要回复图片，不需要回复文字';
        this.handleClick(1);
        this.showEmotionButtons = true; // 显示情感按钮
      }, 25000); // 延时25秒触发
    },

    handleEmotionButtonClick(message) {
      this.text = message;
      this.handleClick(2); // 触发发送
      this.showEmotionButtons = false; // 隐藏情感按钮
    },

    handleEnterKey(event) {
      event.preventDefault();
      this.handleClick();
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const lastMessage = this.$refs[`message-${this.messages.length - 1}`];
        if (lastMessage && lastMessage[0]) {
          lastMessage[0].scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }
};
</script>

<style scoped>
/* 背景图样式 */
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("../../../UI/background.png");
  background-size: cover;
  background-position: bottom;
  filter: blur(1.5px);
  z-index: -1;
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

.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
}

.container {
  width: 70%;
  margin: 0 auto;
  border: 1px solid #000;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
}

.form-group {
  margin-bottom: 20px;
  font-size: 30px; /* 调大文字字号 */
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 30px; /* 增大标签文字的字体大小 */
  cursor: pointer; /* 鼠标悬停时显示手型 */
  margin-right: 20px; /* 增加标签之间的间距 */
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea {
  width: 100%;
  padding: 12px; /* 增加内边距 */
  box-sizing: border-box;
  height: auto;
  min-height: 40px;
  resize: vertical;
  white-space: pre-wrap;
  font-size: 20px; /* 增大输入框中文字的字体大小 */
  line-height: 1.5; /* 调整行间距，确保文本易读 */
  text-align: center; /* 文字水平居中 */
  font-family: "bahnschriftlight";
}

.form-group input[type="radio"] {
  width: 20px;  /* 增大按钮的宽度 */
  height: 20px; /* 增大按钮的高度 */
  margin-right: 10px; /* 增加按钮和文本之间的间距 */
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.button-group button {
  justify-content: space-between;
  align-items: center;
  width: 150px; /* 增加按钮的宽度 */
  height: 50px; /* 增加按钮的高度 */
  padding: 10px; /* 调整内边距，确保按钮内容不会被压缩 */
  font-size: 18px; /* 增大按钮文字的字体大小 */
  border-radius: 8px; /* 调整按钮的圆角 */
  background-color: #007fe7; /* 设置按钮的背景颜色 */
  color: white; /* 设置按钮文字的颜色 */
  cursor: pointer; /* 鼠标悬停时显示手型 */
  transition: background-color 0.3s; /* 增加背景色的过渡效果 */
}

.button-group button:hover {
  background-color: #00b9e7; /* 鼠标悬停时改变背景颜色 */
}
.button-group button {
  width: 100px;
  padding: 5px;
}

.chat-container {
  width: 600px;
  margin: 0 auto;
  margin-top: 50px;
  background-size: cover;
  background-position: center;
}

.messages {
  height: 400px;
  border: 1px solid #ccc;
  overflow-y: auto;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.8);
}

.message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}

.message.sent {
  justify-content: flex-end;
}

.message.received {
  justify-content: flex-start;
}

.message-avatar {
  display: block; /* 确保头像是块级元素 */
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-right: 10px; /* 头像右侧的空隙 */
}

.avatar-right {
  order: 2;
  margin-left: 10px; /* 头像左侧的空隙，当头像在右侧时 */
}

.message-content {
  max-width: calc(80%);
}

.message-text {
  max-width: 100%;
  padding: 10px;
  border-radius: 10px;
  background-color: #f1f1f1;
  border: 1px solid #ccc;
  font-size: 30px; /* 调大文字字号 */
  line-height: 1.5; /* 增加行间距，确保文字易读 */
}

.message.sent .message-text {
  background-color: #dcf8c6;
}

.message.received .message-text {
  background-color: #ffffff;
}

.input-container {
  display: flex;
  height: 40px;
  width: 100%;
  margin-top: 70px;
}

.input-textarea {
  flex-grow: 1;
  height: 40px;
  width: calc(100% - 220px); /* 调整输入框的宽度以适应两个按钮 */
  padding: 10px;
  resize: none;
  border: 1px solid #ccc;
  font-size: 20px; /* 调大文字字号 */
}

.send-button, .emotion-analysis-button {
  height: 60px;
  width: 110px;
  margin-left: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #00ffee; /* 鼠标悬停时改变背景颜色 */
  cursor: pointer;
  font-size: 20px; /* 调大文字字号 */
  border-radius: 10px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* 让容器撑满父元素的高度 */
  width: 100%; /* 让容器撑满父元素的宽度 */
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

.output-container {
  margin-top: 30px;
  width: 1400px;
  height: 600px;
  border: 1px solid #ccc;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.text {
  text-shadow: 0.31rem 0.44rem 0.31rem #1e1008a3;
}

.text_3 {
  color: #ffffff;
  font-size: 3rem;
  font-family: hongleixingshu;
  line-height: 2.16rem;
}

.pos_2 {
  margin-top: -10px;
  position: absolute;
  left: 3.76rem;
  top: 3.27rem;
  cursor: pointer;
}

/* 等待动画 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 新增的情感按钮样式 */
.emotion-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.image-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.emotion-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px solid #3498db;
}
</style>
