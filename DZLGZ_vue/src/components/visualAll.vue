<template>
  <div class="app">
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
    <div class="output-container">
      <div v-for="message in messages" :key="message.id" :class="['message', message.type]">
        <div class="message-text" v-if="message.type === 'sent'">{{ message.text }}</div>
        <div class="message-text" v-if="message.type === 'received'">{{ message.text }}</div>
        <img class="message-image" v-if="message.type === 'image'" :src="message.url"  />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: '',
      // result: '',
      messages: [],
      id: 0
    };
  },
  methods: {
    async handleClick() {
      if (this.text.trim() === '') return;
      // let message_time = Date.now();
      this.messages.push({ id: this.id++, text: this.text, type: 'sent' });
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
        for(const img_url of img_urls) {
          this.messages.push({ id: this.id++, url: img_url, type: 'image' });
        }
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      }
    },
    handleEnterKey(event) {
      // 阻止默认的换行行为
      event.preventDefault();
      this.handleClick();
    }
  }
};
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
}

.input-container {
  display: flex;
  width: 100%;
  margin-bottom: 10px;
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

.output-container {
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
</style>
