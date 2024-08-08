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
          <input type="text" v-model="formData.identity" />
        </div>
        <div class="form-group">
          <label>喜欢的形象：</label>
          <input type="text" v-model="formData.favoriteImage" />
        </div>
        <div class="form-group">
          <label>背景：</label>
          <input type="text" v-model="formData.background" />
        </div>
        <div class="form-group">
          <label>故事情节：</label>
          <input type="text" v-model="formData.story" />
        </div>
        <div class="button-group">
          <button type="button" @click="handleReset">默认</button>
          <button type="submit">确定</button>
        </div>
      </form>
    </div>

    <div v-else class="input-container">
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
    <div class="output-container">
      <div v-for="(message, index) in messages" :key="message.id" :ref="'message-' + index" :class="['message', message.type]">
        <div class="message-text" v-if="message.type === 'sent'">{{ message.text }}</div>
        <div class="message-text" v-if="message.type === 'received'">{{ message.text }}</div>
        <img class="message-image" v-if="message.type === 'image'" :src="message.url"  />
      </div>
      <div v-if="isLoading" class="loading-spinner"></div> <!-- 等待动画 -->
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
        story: ''
      },      
      text: '',
      messages: [],
      isLoading: false, // 用于控制等待动画显示
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
        story: ''
      };
    },
    async handleSubmit() {
      console.log('Submitted data:', this.formData);
      this.showForm = false; // 切换到对话页面
      let buffer = '你只需要回复图片，不回复文字。我是家长。孩子的姓名是'+this.formData.name+'，年龄是'+this.formData.age+'岁，'+this.formData.gender+'孩子，'+this.formData.identity+
      '。画图：喜欢的形象'+this.formData.favoriteImage+
      '。画图：背景'+this.formData.background+
      '。故事情节是：'+this.formData.story+
      '。请你扮演'+this.formData.name+'的角色，让孩子从中感受情感。';
      this.messages.push({ id: this.id++, text: buffer, type: 'set' });
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

        this.messages.push({ id: this.id++, text: resultText, type: 'received' });
        this.scrollToBottom(); // 新增消息后滚动到底部
        for(const img_url of img_urls) {
          this.messages.push({ id: this.id++, url: img_url, type: 'image' });
          this.scrollToBottom(); // 新增消息后滚动到底部
        }
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      } finally {
        this.isLoading = false; // 隐藏等待动画
      }
    },
    async handleClick() {
      if (this.text.trim() === '') return;
      this.messages.push({ id: this.id++, text: this.text, type: 'sent' });
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
        this.messages.push({ id: this.id++, text: resultText, type: 'received' });
        this.scrollToBottom(); // 新增消息后滚动到底部
        for(const img_url of img_urls) {
          this.messages.push({ id: this.id++, url: img_url, type: 'image' });
          this.scrollToBottom(); // 新增消息后滚动到底部
        }
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
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input[type="text"],
.form-group input[type="number"] {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
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
}

.messages {
  height: 400px;
  border: 1px solid #ccc;
  overflow-y: auto;
  padding: 10px;
}

.message {
  display: flex;
  margin-bottom: 10px;
}

.message.user {
  justify-content: flex-end;
}

.message.bot {
  justify-content: flex-start;
}

.message-text {
  max-width: 60%;
  padding: 10px;
  border-radius: 10px;
  background-color: #f1f1f1;
  border: 1px solid #ccc;
}

.message-image {
  max-width: 60%;
  border-radius: 10px;
  border: 1px solid #ccc;
}

.message.user .message-text {
  background-color: #dcf8c6;
}

.message.bot .message-text {
  background-color: #ffffff;
}

.input-container {
  margin-top: 70px; /* 调整输入框的顶部间距 */
  display: flex;
  width: 100%;
  /* margin-bottom: 10px; */
}

.input-textarea {
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
}

.send-button {
  width: 60px;
  margin-left: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
}

.output-container {
  margin-top: 10px; /* 调整输入框的顶部间距 */
  width: 100%;
  height: 600px;
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

.message-image {
  max-width: 60%;
  border-radius: 10px;
  border: 1px solid #ccc;
}

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
