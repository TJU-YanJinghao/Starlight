<template>
  <div class="page">
    <div class="background-image"></div>
    <div class="home-link"><router-link to="/" class="font link">《首页</router-link></div>
    <span class="horizontal-text">云社区</span>
    <div class="content">
      <!-- 搜索框 -->
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索场景、情节..."
          class="search-input"
        />
        <button @click="searchComments" class="search-button">搜索</button>
      </div>

      <!-- 评论列表 -->
      <div class="comments-section">
        <div
          v-for="comment in filteredComments"
          :key="comment.id"
          class="comment-item"
        >
          <img :src="comment.avatar" class="comment-avatar" alt="用户头像" />
          <div class="comment-content">
            <p class="comment-author">{{ comment.author }}:</p>
            <p class="comment-text">{{ comment.text }}</p>
          </div>
        </div>
      </div>

      <!-- 发布新评论 -->
      <div class="input-container">
        <input
          type="text"
          v-model="newComment"
          placeholder="请描述情景..."
          class="input-text"
          @keyup.enter="postComment"
        />
        <button class="send-button" @click="postComment">发布</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      comments: [
        {
          id: 1,
          author: "马小妈妈",
          text: "孩子的姓名是马小，年龄是11岁，男孩子，小学五年级的学生。画图：喜欢的形象以小浣熊为主体，毛色为橙色，穿着蓝色的帽衫，戴着蓝色的帽子。画图：背景发生在下雨的儿童游乐场。故事情节是：孩子和同学王明约好了周末一起去游乐场玩，但是周末突然下了暴雨，无法再去游乐场。请你扮演王明的角色，让孩子从中感受计划失败的失望和难过。",
          avatar: require("@/assets/head1.jpg"), // 使用本地图像
        },
        {
          id: 2,
          author: "麦克妈妈",
          text: "孩子的姓名是麦克，年龄是9岁，男孩子，小学三年级的学生。画图：喜欢的形象以小猴子为主体，毛色为橙色，穿着红色的帽衫，戴着蓝色的帽子。画图：背景发生在放学后的操场。故事情节是：孩子的同学王明邀请孩子周末参加自己的生日派对。请你扮演王明的角色，让孩子从中感受友谊和感动。",
          avatar: require("@/assets/head2.jpg"), // 使用本地图像
        },
        {
          id: 3,
          author: "李丽爸爸",
          text: "孩子的姓名是李丽，年龄是12岁，女孩子，小学六年级的学生。画图：喜欢的形象以小猫为主体，毛色为银白色，穿着白色的帽衫，戴着紫色的帽子。画图：背景发生在清晨的教室。故事情节是：李丽参加舞蹈社团的选拔，没有通过考试。请你扮演李丽的朋友张明明，安慰李丽，让孩子从中感受友谊和感动。",
          avatar: require("@/assets/head3.jpg"), // 使用本地图像
        },
      ],
      newComment: "", // 新评论的内容
      searchQuery: "", // 搜索框的内容
    };
  },
  computed: {
    filteredComments() {
      if (this.searchQuery.trim() === "") {
        return this.comments;
      }
      return this.comments.filter((comment) =>
        comment.text.includes(this.searchQuery.trim())
      );
    },
  },
  methods: {
    postComment() {
      if (this.newComment.trim() !== "") {
        const newCommentData = {
          id: this.comments.length + 1,
          author: "我",
          text: this.newComment.trim(),
          avatar: require("@/assets/head.jpg"), // 添加用户自己的头像
        };

        this.comments.unshift(newCommentData);
        this.newComment = ""; // 发布后清空评论框
      }
    },
    searchComments() {
      console.log("Searching for:", this.searchQuery);
    },
    goToHomepage() {
      this.$router.push({ name: "homepage" });
    },
  },
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

.content {
  margin-top: 100px;
}

.page {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: transparent; /* 背景设置为透明 */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.home-button {
  font-size: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #000;
}

.title {
  font-size: 36px; /* 调整字体大小 */
  font-weight: bold;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* 添加阴影效果 */
}

.search-container {
  height: 60px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-top: 40px; /* 增加顶部外边距，使功能区域下移 */
}

.search-input {
  flex-grow: 1;
  padding: 15px; /* 增加内边距 */
  font-size: 18px; /* 增大字体大小 */
  border: 2px solid #ccc; /* 边框加粗 */
  border-radius: 8px; /* 添加圆角 */
}

.search-button {
  margin-left: 15px; /* 增加按钮与输入框之间的间距 */
  padding: 15px 30px; /* 增加按钮的内边距，扩大按钮尺寸 */
  font-size: 18px; /* 增大字体大小 */
  border: 2px solid #ccc; /* 边框加粗 */
  background-color: #f0f0f0;
  cursor: pointer;
  border-radius: 8px; /* 添加圆角 */
}

.comments-section {
  padding: 10px;
  margin-bottom: 20px;
}

.comment-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.comment-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #4c9ffa;
  margin-right: 10px;
}

.comment-content {
  border: 2px solid rgba(0, 123, 255, 0.8); /* 边框加粗，颜色为半透明蓝色 */
  background-color: rgb(255, 255, 255); /* 半透明蓝色填充背景 */
  flex-grow: 1;
  border-radius: 12px; /* 边角圆滑 */
  padding: 10px; /* 内边距，确保内容不会贴边 */
  margin-bottom: 10px; /* 增加每条评论之间的间距 */
}

.comment-author {
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 5px;
  font-size: 30px; /* 调大文字字号 */
  text-align: left;
}

.comment-text {
  font-size: 18px;
  line-height: 1.6;
  margin: 0;
  text-align: left;
}

.input-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* border: 2px solid #ccc; 边框加粗 */
  padding: 15px; /* 增加内边距 */
  /* background-color: rgba(255, 255, 255, 0.8); 设置输入区的背景为白色并带有透明度 */
  border-radius: 12px; /* 添加圆角 */
  margin-top: 20px; /* 增加顶部间距 */
}

.input-text {
  flex-grow: 1;
  padding: 15px; /* 增加内边距 */
  font-size: 18px; /* 增大字体大小 */
  border: 2px solid #ccc; /* 边框加粗 */
  border-radius: 8px; /* 添加圆角 */
}

.send-button {
  margin-left: 15px; /* 增加按钮与输入框之间的间距 */
  padding: 15px 30px; /* 增加按钮的内边距，扩大按钮尺寸 */
  font-size: 18px; /* 增大字体大小 */
  border: 2px solid #ccc; /* 边框加粗 */
  background-color: #f0f0f0;
  cursor: pointer;
  border-radius: 8px; /* 添加圆角 */
}
</style>
