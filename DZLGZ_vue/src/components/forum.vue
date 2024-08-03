<template>
  <div class="flex-col justify-start items-center relative page">
    <img
      class="image"
      src="../../static/background.png"
    />
    <span class="text text_3 pos_2" @click="goToHomepage">《主页</span>
    <span class="text text_2 pos">读者论坛</span>
    <div class="flex-col section pos_3">
      <div class="flex-row group">
        <img
          class="shrink-0 image_2"
          src="../../static/searchLogo.png"
        />
        <input
          style="caret-color: auto"
          type="text"
          placeholder="搜索评论内容..."
          v-model="searchQuery"
          @keyup.enter="searchComments"
          class="ml-20 group_2 input"
        />
      </div>
      <div class="comments-section">
        <div
          class="flex-row items-center group_3"
          v-for="comment in filteredComments"
          :key="comment.id"
        >
          <img class="shrink-0 image_3" :src="comment.avatar" />
          <div class="flex-col flex-1 group_4 ml-27">
            <span class="self-start text_4">{{ comment.author }}</span>
            <div class="flex-row self-stretch mt-13">
              <div class="flex-col justify-start flex-1 text-wrapper">
                <span class="text_5">{{ comment.text }}</span>
              </div>
              <div
                class="flex-col justify-start items-center shrink-0 self-start text-wrapper_2"
                @click="toggleLike(comment)"
              >
                <span :class="{ text_6: true, likes: comment.likes }">{{comment.likes}}赞</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-row items-center group_5">
        <span class="text_8">+</span>
        <input
          style="caret-color: auto"
          type="text"
          v-model="newComment"
          placeholder="发布评论..."
          class="group_6 input"
          @keyup.enter="postComment"
        />
        <span class="text_7" @click="postComment">评论</span>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
export default {
  data() {
    return {
      comments: [],
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
  created() {
    this.getComments();
  },
  methods: {
    async getComments() {
      try {
        const response = await axios.get("http://localhost:5000/api/forum/commentsAll");
        this.comments = response.data.comments;
        this.comments.forEach((comment) => {
          if (comment.user=this.user){
            comment.avatar = "../../static/MyProfile.png";
          }
          else{
            comment.avatar = "../../static/profile.png";
          }
        });
      } catch (error) {
        console.error("Error fetching comments:", error);
        alert("获取评论时发生错误，请稍后重试！");
      }
    },
    async postComment() {
      if (this.newComment.trim() !== "") {
        const newCommentData = {
          id: this.comments.length + 1,
          avatar: "../../static/MyProfile.png", // 用户头像
          author: "我",
          text: this.newComment.trim(),
          likes: 0,
          timestamp: new Date().toLocaleString(), // 添加时间戳
        };

        this.comments.unshift(newCommentData);
        try {
          await axios.post("http://localhost:5000/api/forum/writeComments", {
            text: this.newComment.trim(),
          });
          this.newComment = ""; // 发布后清空评论框
        } catch (error) {
          console.error("Error posting comment:", error);
          alert("发布评论时发生错误，请稍后重试！");
        }
      }
    },
    searchComments() {
      console.log("Searching for:", this.searchQuery);
    },
    toggleLike(comment) {
      comment.likes += 1;
      try {
        axios.post("http://localhost:5000/api/forum/likeComments", {
          id: comment.id,
        });
      } catch (error) {
        console.error("Error liking comment:", error);
        alert("点赞评论时发生错误，请稍后重试！");
      }
    },
    goToHomepage() {
      this.$router.push({ name: "homepage" });
    },
  },
};
</script>

<style scoped>
/************************************************************
** 请将全局样式拷贝到项目的全局 CSS 文件或者当前页面的顶部 **
** 否则页面将无法正常显示                                  **
************************************************************/
/* 隐藏光标 */
div,
span,
p {
  caret-color: transparent;
}

html {
  font-size: 16px;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    "Microsoft Yahei", sans-serif;
}

body * {
  box-sizing: border-box;
  flex-shrink: 0;
}

#app {
  width: 100vw;
  height: 100vh;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.justify-start {
  justify-content: flex-start;
}

.justify-end {
  justify-content: flex-end;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-around {
  justify-content: space-around;
}

.justify-evenly {
  justify-content: space-evenly;
}

.items-start {
  align-items: flex-start;
}

.items-end {
  align-items: flex-end;
}

.items-center {
  align-items: center;
}

.items-baseline {
  align-items: baseline;
}

.items-stretch {
  align-items: stretch;
}

.self-start {
  align-self: flex-start;
}

.self-end {
  align-self: flex-end;
}

.self-center {
  align-self: center;
}

.self-baseline {
  align-self: baseline;
}

.self-stretch {
  align-self: stretch;
}

.flex-1 {
  flex: 1 1 0%;
}

.flex-auto {
  flex: 1 1 auto;
}

.grow {
  flex-grow: 1;
}

.grow-0 {
  flex-grow: 0;
}

.shrink {
  flex-shrink: 1;
}

.shrink-0 {
  flex-shrink: 0;
}

.relative {
  position: relative;
}

.ml-2 {
  margin-left: 0.13rem;
}

.mt-2 {
  margin-top: 0.13rem;
}

.ml-4 {
  margin-left: 0.25rem;
}

.mt-4 {
  margin-top: 0.25rem;
}

.ml-6 {
  margin-left: 0.38rem;
}

.mt-6 {
  margin-top: 0.38rem;
}

.ml-8 {
  margin-left: 0.5rem;
}

.mt-8 {
  margin-top: 0.5rem;
}

.ml-10 {
  margin-left: 0.63rem;
}

.mt-10 {
  margin-top: 0.63rem;
}

.ml-12 {
  margin-left: 0.75rem;
}

.mt-12 {
  margin-top: 0.75rem;
}

.ml-14 {
  margin-left: 0.88rem;
}

.mt-14 {
  margin-top: 0.88rem;
}

.ml-16 {
  margin-left: 1rem;
}

.mt-16 {
  margin-top: 1rem;
}

.ml-18 {
  margin-left: 1.13rem;
}

.mt-18 {
  margin-top: 1.13rem;
}

.ml-20 {
  margin-left: 1.25rem;
}

.mt-20 {
  margin-top: 1.25rem;
}

.ml-22 {
  margin-left: 1.38rem;
}

.mt-22 {
  margin-top: 1.38rem;
}

.ml-24 {
  margin-left: 1.5rem;
}

.mt-24 {
  margin-top: 1.5rem;
}

.ml-26 {
  margin-left: 1.63rem;
}

.mt-26 {
  margin-top: 1.63rem;
}

.ml-28 {
  margin-left: 1.75rem;
}

.mt-28 {
  margin-top: 1.75rem;
}

.ml-30 {
  margin-left: 1.88rem;
}

.mt-30 {
  margin-top: 1.88rem;
}

.ml-32 {
  margin-left: 2rem;
}

.mt-32 {
  margin-top: 2rem;
}

.ml-34 {
  margin-left: 2.13rem;
}

.mt-34 {
  margin-top: 2.13rem;
}

.ml-36 {
  margin-left: 2.25rem;
}

.mt-36 {
  margin-top: 2.25rem;
}

.ml-38 {
  margin-left: 2.38rem;
}

.mt-38 {
  margin-top: 2.38rem;
}

.ml-40 {
  margin-left: 2.5rem;
}

.mt-40 {
  margin-top: 2.5rem;
}

.ml-42 {
  margin-left: 2.63rem;
}

.mt-42 {
  margin-top: 2.63rem;
}

.ml-44 {
  margin-left: 2.75rem;
}

.mt-44 {
  margin-top: 2.75rem;
}

.ml-46 {
  margin-left: 2.88rem;
}

.mt-46 {
  margin-top: 2.88rem;
}

.ml-48 {
  margin-left: 3rem;
}

.mt-48 {
  margin-top: 3rem;
}

.ml-50 {
  margin-left: 3.13rem;
}

.mt-50 {
  margin-top: 3.13rem;
}

.ml-52 {
  margin-left: 3.25rem;
}

.mt-52 {
  margin-top: 3.25rem;
}

.ml-54 {
  margin-left: 3.38rem;
}

.mt-54 {
  margin-top: 3.38rem;
}

.ml-56 {
  margin-left: 3.5rem;
}

.mt-56 {
  margin-top: 3.5rem;
}

.ml-58 {
  margin-left: 3.63rem;
}

.mt-58 {
  margin-top: 3.63rem;
}

.ml-60 {
  margin-left: 3.75rem;
}

.mt-60 {
  margin-top: 3.75rem;
}

.ml-62 {
  margin-left: 3.88rem;
}

.mt-62 {
  margin-top: 3.88rem;
}

.ml-64 {
  margin-left: 4rem;
}

.mt-64 {
  margin-top: 4rem;
}

.ml-66 {
  margin-left: 4.13rem;
}

.mt-66 {
  margin-top: 4.13rem;
}

.ml-68 {
  margin-left: 4.25rem;
}

.mt-68 {
  margin-top: 4.25rem;
}

.ml-70 {
  margin-left: 4.38rem;
}

.mt-70 {
  margin-top: 4.38rem;
}

.ml-72 {
  margin-left: 4.5rem;
}

.mt-72 {
  margin-top: 4.5rem;
}

.ml-74 {
  margin-left: 4.63rem;
}

.mt-74 {
  margin-top: 4.63rem;
}

.ml-76 {
  margin-left: 4.75rem;
}

.mt-76 {
  margin-top: 4.75rem;
}

.ml-78 {
  margin-left: 4.88rem;
}

.mt-78 {
  margin-top: 4.88rem;
}

.ml-80 {
  margin-left: 5rem;
}

.mt-80 {
  margin-top: 5rem;
}

.ml-82 {
  margin-left: 5.13rem;
}

.mt-82 {
  margin-top: 5.13rem;
}

.ml-84 {
  margin-left: 5.25rem;
}

.mt-84 {
  margin-top: 5.25rem;
}

.ml-86 {
  margin-left: 5.38rem;
}

.mt-86 {
  margin-top: 5.38rem;
}

.ml-88 {
  margin-left: 5.5rem;
}

.mt-88 {
  margin-top: 5.5rem;
}

.ml-90 {
  margin-left: 5.63rem;
}

.mt-90 {
  margin-top: 5.63rem;
}

.ml-92 {
  margin-left: 5.75rem;
}

.mt-92 {
  margin-top: 5.75rem;
}

.ml-94 {
  margin-left: 5.88rem;
}

.mt-94 {
  margin-top: 5.88rem;
}

.ml-96 {
  margin-left: 6rem;
}

.mt-96 {
  margin-top: 6rem;
}

.ml-98 {
  margin-left: 6.13rem;
}

.mt-98 {
  margin-top: 6.13rem;
}

.ml-100 {
  margin-left: 6.25rem;
}

.mt-100 {
  margin-top: 6.25rem;
}
/*****************************/
.ml-27 {
  margin-left: 1.69rem;
}
.mt-13 {
  margin-top: 0.81rem;
}
.page {
  background-color: #ffffff;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}
.image {
  filter: blur(0.17rem);
  width: 100vw;
  height: 56.25vw;
}
.text {
  text-shadow: 0.31rem 0.44rem 0.31rem #1e1008a3;
}

.text_5 {
margin-left: 0.4rem; /* 80% of 0.5rem */
margin-right: 1.10rem; /* 80% of 1.38rem */
color: #4b3010cc;
font-size: 1.2rem; /* 80% of 1.5rem */
font-family: HYQiHei;
line-height: 1.45rem; /* 80% of 1.81rem */
white-space: pre-wrap;
word-break: break-all;
}
.text_3 {
  color: #ffffff;
  font-size: 3rem;
  font-family: hongleixingshu;
  line-height: 2.16rem;
}
.pos_2 {
  position: absolute;
  left: 3.76rem;
  top: 3.27rem;
}
.text_2 {
  color: #ffffff;
  font-size: 4.5rem;
  font-family: hongleixingshu;
  line-height: 3.74rem;
}
.pos {
  position: absolute;
  left: 50%;
  top: 1.84rem;
  transform: translateX(-50%);
}
.section {
  padding: 3.81rem 10.19rem 3rem;
  background-image: url("../../static/bgColor.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.pos_3 {
  position: absolute;
  left: 0;
  right: 0;
  top: 7.94rem;
}
.group {
  padding: 0 3.09rem;
}
.image_2 {
  width: 4.13rem;
  height: 4.13rem;
  transform: translateX(-1cm);
}
.group_2 {
  flex: 1 1 0;
  margin-right: 3.5rem;
  margin-left: 0.1rem;
}
.group_3 {
  margin-top: 2.55rem; /* 80% of 3.19rem */
}
.image_3 {
  width: 4.90rem; /* 80% of 6.13rem */
  height: 4.90rem; /* 80% of 6.13rem */
  cursor: pointer; /* 增加鼠标指针变化 */
}
.group_4 {
  margin-right: 2rem; /* 80% of 2.5rem */
  margin-top: 0.30rem; /* 80% of 0.38rem */
}
.text_4 {
  margin-left: 0.4rem; /* 80% of 0.5rem */
  color: #a17c51cc;
  font-size: 1rem; /* 80% of 1.25rem */
  font-family: HYQiHei;
  line-height: 0.91rem; /* 80% of 1.14rem */
}
.text-wrapper {
  padding: 0.2rem 0 0.30rem; /* 80% of original values */
  background-image: linear-gradient(90deg, #e3cbb1 0%, #dbbb9600 100%);
  height: 3.65rem; /* 80% of 4.56rem */
}
.text-wrapper_2 {
  margin-top: 0.20rem; /* 80% of 0.25rem */
  padding: 0.10rem 0 0.40rem; /* 80% of original values */
  border-radius: 50%;
  width: 6rem; /* 80% of 2.44rem */
  height: 1.95rem; /* 80% of 2.44rem */
  border-left: solid 0.05rem #946e43; /* 80% of 0.063rem */
  border-right: solid 0.05rem #946e43; /* 80% of 0.063rem */
  border-top: solid 0.05rem #946e43; /* 80% of 0.063rem */
  border-bottom: solid 0.05rem #946e43; /* 80% of 0.063rem */
  cursor: pointer; /* 增加鼠标指针变化 */
  user-select: none; /* 禁止文字选择 */
}
.text-wrapper_2 {
  margin-top: 0.20rem; /* 80% of 0.25rem */
  padding: 0.10rem 0 0.40rem; /* 80% of original values */
  border-radius: 50%;
  width: 6rem; /* 80% of 2.44rem */
  height: 1.95rem; /* 80% of 2.44rem */
  border-left: solid 0.05rem #946e43; /* 80% of 0.063rem */
  border-right: solid 0.05rem #946e43; /* 80% of 0.063rem */
  border-top: solid 0.05rem #946e43; /* 80% of 0.063rem */
  border-bottom: solid 0.05rem #946e43; /* 80% of 0.063rem */
  cursor: pointer; /* 增加鼠标指针变化 */
}
.text_6 {
  color: #977d59;
  font-size: 1.6rem; /* 80% of 2rem */
  font-family: hongleixingshu;
  line-height: 1.31rem; /* 80% of 1.64rem */
}
.likes {
  color: red;
}
.group_5 {
  margin-top: 34.44rem  4.13rem 0;
  padding: 0 1.34rem;
}
.text_8 {
  color: #946e43;
  font-size: 3rem;
  font-family: HYQiHei;
  line-height: 1.42rem;
}
.group_6 {
  flex: 1 1 0;
  margin-left: 2.41rem;
}
.input {
  height: 3.13rem;
  border-left: solid 0.063rem #946e43;
  border-right: solid 0.063rem #946e43;
  border-top: solid 0.063rem #946e43;
  border-bottom: solid 0.063rem #946e43;
}
.text_7 {
  margin-left: 1.37rem;
  color: #4b3010;
  font-size: 2.5rem;
  font-family: hongleixingshu;
  line-height: 1.95rem;
  text-shadow: 0rem 0.25rem 0.25rem #00000040;
  cursor: pointer; /* 增加鼠标指针变化 */
}

.comments-section {
   height: calc(100vh - 20rem);
  overflow-y: auto;
}
</style>
