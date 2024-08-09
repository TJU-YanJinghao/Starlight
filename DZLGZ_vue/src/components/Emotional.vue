<template>
  <div class="app">
    <!-- 背景图容器，使用CSS背景图 -->
    <div class="background-image"></div>
    <span class="text text_3 pos_2" @click="goHome">《主页</span>
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
          <textarea v-model="formData.identity" ></textarea>
        </div>
        <div class="form-group">
          <label>喜欢的形象：</label>
          <textarea v-model="formData.favoriteImage" ></textarea>
        </div>
        <div class="form-group">
          <label>背景：</label>
          <textarea v-model="formData.background" ></textarea>
        </div>
        <div class="form-group">
          <label>故事情节：</label>
          <textarea v-model="formData.story" ></textarea>
        </div>
        <div class="form-group">
          <label>感受：</label>
          <textarea v-model="formData.emotional" ></textarea>
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
        <button
          class="send-button"
          @click="handleClick"
        >
          发送
        </button>
      </div>
      <div class="output-container" :style="{'background-image': 'url(' + backgroundUrl + ')'}">
        <div v-for="(message, index) in messages" :key="message.id" :ref="'message-' + index" :class="['message', message.type]">
          <img :src=message.avatar class="message-avatar" :class="message.type === 'sent' ? 'avatar-right' : ''" />
          <div class="message-content"></div>
            <div class="message-text" v-if="message.type === 'sent'">{{ message.text }}</div>
            <div class="message-text" v-if="message.type === 'received'">{{ message.text }}</div>
          <!-- <img class="message-image" v-if="message.type === 'image'" :src="message.url"  /> -->
        </div>
        <div v-if="isLoading" class="loading-spinner"></div> <!-- 等待动画 -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showForm: true, // 用于控制页面显示
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
      isLoading: false, // 用于控制等待动画显示
      backgroundUrl: '', // 对话框背景图像的URL
      modelAvatar: '',
      userAvatar: "../../../UI/head.jpg", // 用户头像的URL
      id: 0
    };
  },
  methods: {
    goHome() {
          this.$router.push({ name: 'homepage' });
        },
    handleReset() {
      this.formData = {
        name: '',
        age: '',
        gender: '',
        identity: '',
        favoriteImage: '',
        background: '',
        story: '',
        emotional: ''
      };
      this.userAvatar="../../../UI/head.jpg";
    },
    async handleSubmit() {
      console.log('Submitted data:', this.formData);
      this.showForm = false; // 切换到对话页面
      let buffer = '我是家长。孩子的姓名是'+this.formData.name+'，年龄是'+this.formData.age+'岁，'+this.formData.gender+'孩子，'+this.formData.identity+
      '。画图：喜欢的形象'+this.formData.favoriteImage+
      '。画图：背景'+this.formData.background+
      '。故事情节是：'+this.formData.story+
      '。让孩子从中感受'+this.formData.emotional+'。';
      // this.messages.push({ id: this.id++, text: buffer, type: 'set',avatar: this.userAvatar });
      this.scrollToBottom(); // 新增消息后滚动到底部
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
          console.log(chunk); // 调试信息

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
                }
                else if(data.event === 'message_file' && data.url) {
                  img_urls.push(data.url);
                }
              } catch (e) {
                console.error('JSON解析错误：', e);
              }
            }
          }
        }

        // this.messages.push({ id: this.id++, text: resultText, type: 'received' });
        // this.scrollToBottom(); // 新增消息后滚动到底部
        // for(const img_url of img_urls) {
        //   this.messages.push({ id: this.id++, url: img_url, type: 'image' });
        //   this.scrollToBottom(); // 新增消息后滚动到底部
        // }
        const imageUrl = img_urls[1];
        this.backgroundUrl = imageUrl;
        const avatarUrl = img_urls[0];
        this.modelAvatar = avatarUrl;
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      } finally {
        this.isLoading = false; // 隐藏等待动画
      }
    },

    async handleClick() {
      if (this.text.trim() === '') return;
      this.messages.push({ id: this.id++, text: this.text, type: 'sent', avatar: this.userAvatar });
      this.scrollToBottom(); // 新增消息后滚动到底部
      this.isLoading = true; // 显示等待动画

      const url = 'https://open.oppomobile.com/agentplatform/app_api/chat';
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 5MfWH1dNeBUdpBvQ'
      };
      const body = JSON.stringify({
        query: this.text,
        response_mode: 'streaming',
        conversation_id: '',
        user: '用户唯一标识',
        files: []
      });

      this.text = '';

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
          console.log(chunk); // 调试信息

          buffer += chunk;
        }
        let lines = buffer.split('\n');
          
        // 保留最后一行，可能是不完整的行
        // buffer = lines.pop();
        
        for (const line of lines) {
          if (line.trim().startsWith('data: ')) {
            const dataStr = line.trim().substring(6);
            if (dataStr !== 'ping') {
              try {
                const data = JSON.parse(dataStr);
                if (data.event === 'agent_message' && data.answer) {
                  resultText += data.answer;
                }
                else if(data.event === 'message_file' && data.url) {
                  img_urls.push(data.url);
                }
              } catch (e) {
                console.error('JSON解析错误：', e);
              }
            }
          }
        }
        // 处理可能剩余的不完整行
        // if (buffer.trim().startsWith('data: ')) {
        //   const dataStr = buffer.trim().substring(6);
        //   if (dataStr !== 'ping') {
        //     try {
        //       const data = JSON.parse(dataStr);
        //       if (data.event === 'agent_message' && data.answer) {
        //         resultText += data.answer;
        //       }
        //     } catch (e) {
        //       console.error('JSON解析错误：', e);
        //     }
        //   }
        // }
        this.messages.push({ id: this.id++, text: resultText, type: 'received', avatar: this.modelAvatar });
        this.scrollToBottom(); // 新增消息后滚动到底部
        // for(const img_url of img_urls) {
        //   this.messages.push({ id: this.id++, url: img_url, type: 'image' });
        //   this.scrollToBottom(); // 新增消息后滚动到底部
        // }
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      } finally {
        this.isLoading = false; // 隐藏等待动画
      }
    },
    handleEnterKey(event) {
      // 阻止默认的换行行为
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
  background-size: cover; /* 确保背景图保持比例 */
  background-position: bottom; /* 保留下半部分 */
  filter: blur(1.5px); /* 添加模糊效果 */
  z-index: -1; /* 设置为最底层 */
}

.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
}

.container {
  width: 400px;
  margin: 0 auto;
  border: 1px solid #000;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8); /* 使表单背景半透明 */
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea {
  width: 100%; /* 确保输入框和文本域宽度为100% */
  padding: 10px; /* 增加内边距 */
  box-sizing: border-box;
  height: auto; /* 自动调整高度 */
  min-height: 40px; /* 最小高度 */
  resize: vertical; /* 允许用户垂直调整大小 */
  white-space: pre-wrap; /* 保留空白字符并自动换行 */
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.button-group button {
  width: 100px;
  padding: 5px;
}

.chat-container {
  width: 600px;
  margin: 0 auto;
  margin-top: 50px; /* 调整对话框的顶部间距 */
  background-size: cover; /* 确保背景图片覆盖整个容器 */
  background-position: center; /* 确保背景图片在容器中居中 */
}

.messages {
  height: 400px;
  border: 1px solid #ccc;
  overflow-y: auto;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.8); /* 使对话框背景半透明 */
}

.message {
  display: flex;
  align-items: flex-start; /* 对齐消息和头像 */
  margin-bottom: 10px;
}

.message.user {
  justify-content: flex-end;
}

.message.bot {
  justify-content: flex-start;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.avatar-right {
  order: 2;
  margin-left: 10px;
}

.message-content {
  max-width: calc(100% - 50px); /* 留出头像的空间 */
}

.message-text {
  max-width: 100%;
  padding: 10px;
  border-radius: 10px;
  background-color: #f1f1f1;
  border: 1px solid #ccc;
}

/* .message-image {
  max-width: 60%;
  border-radius: 10px;
  border: 1px solid #ccc;
} */

.message.user .message-text {
  background-color: #dcf8c6;
}

.message.bot .message-text {
  background-color: #ffffff;
}

.input-container {
  display: flex;
  width: 100%;
  margin-top: 70px; /* 调整输入框的顶部间距 */
}

.input-textarea {
  flex-grow: 1;
  height: 60px; /* 调整输入框的高度 */
  width: calc(100% - 80px); /* 调整输入框的宽度，留出按钮的位置 */
  padding: 10px;
  resize: none;
  border: 1px solid #ccc;
}

.send-button {
  width: 80px; /* 调整按钮宽度以配合输入框 */
  margin-left: 10px;
  padding: 10px; /* 调整按钮的内边距 */
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
}

/* .loading-spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
  margin: 20px auto;
} */

/* .input-textarea {
  flex-grow: 1;
  height: 40px;
  padding: 5px;
  resize: none;
  border: 1px solid #ccc;
}

.send-button {
  width: 60px;
  margin-left: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
} */

.output-container {
  margin-top: 10px; /* 调整输入框的顶部间距 */
  width: 1600px;
  height: 680px;
  border: 1px solid #ccc;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.message {
  display: flex;
  margin-bottom: 10px;
}

.message.sent {
  justify-content: flex-end;
}

.message.received {
  justify-content: flex-start;
}

.message-text {
  max-width: 60%;
  padding: 10px;
  border-radius: 10px;
  background-color: #f1f1f1;
  border: 1px solid #ccc;
}

/* .message-image {
  max-width: 60%;
  border-radius: 10px;
  border: 1px solid #ccc;
} */

.message.sent .message-text {
  background-color: #dcf8c6;
}

.message.received .message-text {
  background-color: #ffffff;
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
  margin-top: -10px; /* 调整输入框的顶部间距 */
  position: absolute;
  left: 3.76rem;
  top: 3.27rem;
  cursor: pointer;
}

/* 等待动画 */
.loading-spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
