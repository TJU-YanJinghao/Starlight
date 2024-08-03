<template>
  <div class="flex-col justify-start items-center relative page">
    <span class="text text_3 pos_2" @click="goToHomepage">《主页</span>
    <span class="text text_2 pos">语义检索</span>
    <div class="flex-col section pos_3">
      <div class="flex-row items-center group move-left-3cm">
        <img class="shrink-0 image_2" src="../../static/searchLogo.png" />
        <input v-model="searchQuery" @keyup.enter="search" class="input group_2" placeholder="请输入搜索词" />
        <span class="text_4" @click="search">搜索</span>
      </div>
      <div v-if="noResults" class="no-results">抱歉，该数据库暂未收录该人物</div>
      <div class="flex-col items-start group_3 move-left-3cm" v-if="results.length > 0">
        <div class="result-item" v-for="result in results" :key="result.id">
          <div class="flex-row section_2">
            <div class="flex-row  column">
              <div class="flex-row items-baseline ">
                <span class="font text_5">人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;物</span>
                <span class="font_2 text_6">{{ result.name || 'N/A' }}</span>
              </div>
              <div class="flex-row items-baseline shrink-0">
                <span class="font text_5">时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间</span>
                <span class="font_2 text_6">{{ result.time1 || 'N/A' }}</span>
              </div>
              <div class="flex-row items-baseline shrink-0">
                <span class="font text_5">主要事件</span>
                <span class="font_2 text_6">{{ result.mainthing || 'N/A' }}</span>
              </div>
              <div class="flex-row items-baseline shrink-0">
                <span class="font text_5">人物评价</span>
                <span class="font_2 text_6">{{ result.pingjia || 'N/A' }}</span>
              </div>
            </div>
          </div>
          <div class="flex-col group_5">
            <div class="flex-row relative group_6">
              <div class="self-center group_7"></div>
              <div class="flex-col self-center group_9">
                <span class="self-start font text_21">{{ result.successor || 'N/A' }}</span>
                <div class="flex-row self-stretch group_10 mt-25">
                  <span class="font_2 text_22">时间</span>
                  <span class="font_2 ml-21">{{ result.successorTime || 'N/A' }}</span>
                </div>
                <div class="flex-row items-baseline self-stretch group_12 mt-25">
                  <span class="font_2 text_25">首见页码</span>
                  <span class="ml-20 font_2 text_30">{{ result.page || 'N/A' }}</span>
                </div>
              </div>
              <div class="flex-col self-start group_11">
                <div class="flex-row">
                  <span class="font_2 text_23">国家</span>
                  <span class="ml-20 font_3">{{ result.successorCountry || 'N/A' }}</span>
                </div>
                <span class="font_2 text_26 mt-25">社会身份</span>
              </div>
              <span class="self-start font_2 text_27">{{ result.role || 'N/A' }}</span>
              <div class="flex-row justify-between items-end group_8 pos_4">
                <img class="group_7" :src="pictureSrc || '../../static/people.png'" />
                <div class="flex-col">
                  <div class="flex-row">
                    <span class="font_2 text_24">地点</span>
                    <span class="ml-20 font_4">{{ result.successorLocation || 'N/A' }}</span>
                  </div>
                  <div class="flex-row mt-25">
                    <span class="font_2 text_28">出现回目</span>
                    <span class="font_2 text_29 ml-33">{{ result.chapters || 'N/A' }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex-col justify-start items-start text-wrapper">
              <span class="font_2 text_31">{{ result.txt || 'N/A' }}</span>
            </div>
          </div>
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
      searchQuery: '',
      profile: [],
      results: [],
      pictureSrc: '',
      baseURL: 'http://localhost:5000/api',
    };
  },
  methods: {
    goToHomepage() {
      this.$router.push({ name: "homepage" });
    },
    async search() {
      try {
        const response = await axios.get('/qa/KGQA_answer', {
          params: { name: this.searchQuery },
          baseURL: this.baseURL,
          withCredentials: true,
        });

        const { data, links } = response.data[0];
        this.profile = response.data[1];
        const picture = response.data[2];

        if (Array.isArray(data) && Array.isArray(links)) {
          this.results = [{
            name: this.profile[4] || 'N/A',
            time1: this.profile[2] || 'N/A',
            mainthing: this.profile[9] || 'N/A',
            pingjia: this.profile[10] || 'N/A',
            successor: this.profile[4] || 'N/A',
            successorTime: this.profile[2] || 'N/A',
            page: this.profile[0] || 'N/A',
            successorCountry: this.profile[3] || 'N/A',
            role: this.profile[7] || 'N/A',
            successorLocation: this.profile[3] || 'N/A',
            chapters: this.profile[8] || 'N/A',
            txt: this.profile[1] || 'N/A',
            id: 0 // Assuming there's only one result
          }];
          this.pictureSrc = `data:image/jpg;base64,${picture}`;
        } else {
          console.error('Invalid response format:', response.data);
        }
      } catch (error) {
        if(error.response.status === 401)
        {
          alert("未登录或不存在该信息");
        }
        console.error('Error fetching data:', error);
      }
    },
  },
};
</script>


<style scoped>
/************************************************************
** 请将全局样式拷贝到项目的全局 CSS 文件或者当前页面的顶部 **
** 否则页面将无法正常显示                                  **
************************************************************/
.no-results {
  font-size: 2rem; /* 放大字体 */
  color: #ff0000; /* 可以根据需要调整颜色 */
  text-align: center; /* 居中对齐文本 */
  margin-top: 2rem; /* 增加顶部间距，使其与其他内容分开 */
  margin-left: -7.5cm;
}
html {
  font-size: 12px;
}
.move-left-3cm {
  margin-left: -2.5cm;
}
body {
  margin: 0;
  font-family: "hongleixingshu", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
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
/*********************************************/

.ml-21 {
  margin-left: 1.31rem;
}
.ml-171 {
  margin-left: 10.69rem;
}
.ml-197 {
  margin-left: 12.31rem;
}
.ml-61 {
  margin-left: 3.81rem;
}
.ml-146 {
  margin-left: 9.13rem;
}
.ml-73 {
  margin-left: 4.56rem;
}
.mt-25 {
  margin-top: 1.56rem;
}
.ml-33 {
  margin-left: 2.06rem;
}
.page {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  background-image: url('../../static/background.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.image {
  filter: blur(0.17rem);
  width: 100vw;
  height: 56.25vw;
}

.text {
  text-shadow: 0.31rem 0.44rem 0.31rem #1e1008a3;
}

.text_3 {
  color: #ffffff;
  font-size: 3rem;
  font-family: "hongleixingshu"; 
  line-height: 2.16rem;
}

.pos_2 {
  position: absolute;
  left: 3.76rem;
  top: 3.27rem;
  cursor: pointer;
}

.text_2 {
  color: #ffffff;
  font-size: 4.3rem;
  font-family: "hongleixingshu"; 
  line-height: 3.3rem;
}

.pos {
  position: absolute;
  left: 50%;
  top: 1.99rem;
  transform: translateX(-50%);
}

.section {
  padding: 3.06rem 7.13rem 6.88rem 21.31rem; /* 保持原始的 padding 设置 */
  background-image: url("../../static/bgColor.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  max-width: none; /* 将 max-width 属性设为 none，以允许无限制地放大 */
}


.pos_3 {
  position: absolute;
  left: 0;
  right: 0;
  top: 7.94rem;
}

.group {
  padding: 0 0.01rem;
}
.group {
  padding: 0 0.001rem;
  display: flex;
  width: 100%;
}
.image_2 {
  width: 3.13rem;
  height: 3.13rem;
}

.input {
  flex: 1 1 0;
  margin-left: 0.28rem;
}

.group_2 {
  height: 3.13rem;
  border-left: solid 0.063rem #946e43;
  border-right: solid 0.063rem #946e43;
  border-top: solid 0.063rem #946e43;
  border-bottom: solid 0.063rem #946e43;
}

.text_4 {
  caret-color: transparent;
  margin-left: 1.37rem;
  color: #4b3010;
  font-size: 2.5rem;
  font-family: "hongleixingshu";
  line-height: 1.95rem;
  text-shadow: 0rem 0.25rem 0.25rem #00000040;
  cursor: pointer; /* 增加鼠标指针变化 */
}

.group_3 {
  margin-top: 2.94rem;
  padding: 0 1.19rem;
}

.section_2 {
  padding: 0.38rem 1.88rem 0.75rem;
  background-image: linear-gradient(90deg, #e3cbb1 0%, #dbbb9600 100%);
}

.font {
  font-family: "hongleixingshu"; 
  color: #4b3010;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 1rem;
}
.font_2 {
  font-size: 1.5rem;
  font-family: "hongleixingshu"; 
  line-height: 1.4rem;
  color: #4b3010cc;
  margin-left: 1rem;
  text-align: left; /* 左对齐 */
}
.text_5 {
  line-height: 1.92rem;
}
.text_6 {
  line-height: 1.35rem;
}
.section_3 {
  padding: 0.5rem 1.88rem;
  background-image: linear-gradient(90deg, #e3cbb1 0%, #dbbb9600 100%);
}
.text_10 {
  line-height: 2.16rem;
}
.group_4 {
  margin-left: 4.75rem;
}
.section_4 {
  padding: 0.63rem 2.25rem 0.38rem;
  background-image: linear-gradient(90deg, #e3cbb1 0%, #dbbb9600 100%);
}
.text_13 {
  line-height: 2.1rem;
}
.section_5 {
  padding: 0.63rem 1.88rem;
  background-image: linear-gradient(90deg, #e3cbb1 0%, #dbbb9600 100%);
}
.text_17 {
  line-height: 1.85rem;
}
.group_5 {
  margin-top: 5.06rem;
}
.group_6 {
  padding-bottom: 2.5rem;
}
.group_7 {
  filter: drop-shadow(0rem 0.25rem 0.13rem #00000040);
  width: 8.44rem;
  height: 8.44rem;
}
.group_9 {
  margin-left: 3.13rem;
}
.text_21 {
  line-height: 1.99rem;
}
.group_10 {
  padding-left: 0.25rem;
}
.group_12 {
  padding: 0 0.25rem;
}
.font_4 {
  font-size: 1.5rem;
  font-family: "hongleixingshu"; 
  line-height: 1.33rem;
  color: #4b3010cc;
}
.text_20 {
  margin-left: 12.38rem;
  margin-right: 17.5rem;
}
.text_19 {
  margin-left: 11.63rem;
}
.font_3 {
  font-size: 1.5rem;
  font-family: "hongleixingshu"; 
  line-height: 1.28rem;
  color: #4b3010cc;
}
.text_16 {
  margin-left: 13.88rem;
  margin-right: 18.75rem;
}
.text_9 {
  margin: 0.63rem 15.88rem 0 10.75rem;
}

.text_25 {
  line-height: 1.4rem;
}
.text_22 {
  line-height: 1.35rem;
}
.text_18 {
  line-height: 1.35rem;
}
.text_15 {
  margin-left: 13.25rem;
  line-height: 1.35rem;
}
.text_14 {
  line-height: 1.4rem;
}
.text_12 {
  margin-left: 5.5rem;
  margin-right: 11.5rem;
}
.text_11 {
  margin-left: 4.81rem;
}
.text_8 {
  margin-left: 10.13rem;
  line-height: 1.35rem;
}
.text_7 {
  line-height: 1.39rem;
}

.text_30 {
  line-height: 1.08rem;
}
.group_11 {
  margin-left: 4.63rem;
  margin-top: 4rem;
}
.text_23 {
  line-height: 1.36rem;
}
.text_26 {
  line-height: 1.37rem;
}
.text_27 {
  margin-left: 1.13rem;
  margin-top: 7rem;
  line-height: 1.36rem;
}
.group_8 {
  width: 70.94rem;
}
.pos_4 {
  position: absolute;
  left: 0;
  top: 0;
}
.text_24 {
  line-height: 1.34rem;
}
.text_28 {
  line-height: 1.37rem;
}
.text_29 {
  line-height: 1.37rem;
}
.text-wrapper {
  margin-left: 0.81rem;
  padding: 2rem 0 2.25rem;
  background-image: linear-gradient(90deg, #e3cbb1 0%, #dbbb9600 100%);
}
.text_31 {
  margin-left: 5.25rem;
  line-height: 1.81rem;
  width: 68.94rem;
}
.result-item {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.column {
  display: flex;
  flex-direction: column;
}

</style>