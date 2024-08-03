<template>
  <div class="flex-col justify-start items-center relative page">
    <img class="image" src="../../static/background.png" />
    <button class="btn back-button pos_2" @click="goBack">《返回</button>
    <span class="text text_2 pos">近读</span>
    <div class="content">
      <div id="guanxi" ref="guanxi" class="graph-container"></div>
      <div class="profile-container">
        <h3>人物画像</h3>
        <img id="picture" :src="pictureSrc" class="profile-picture" />
        <h3>人物简介</h3>
        <div id="profile" class="flex-col items-start group_3" v-if="results.length > 0">
          <div class="result-item">
            <span>人物：{{ results[0].name || 'N/A' }}</span><br>
            <span>时间：{{ results[0].time1 || 'N/A' }}</span><br>
            <span>主要事件：{{ results[0].mainthing || 'N/A' }}</span><br>
            <span>人物评价：{{ results[0].pingjia || 'N/A' }}</span><br>
            <span>首见页码：{{ results[0].successorTime || 'N/A' }}</span><br>
            <span>国家：{{ results[0].successorCountry || 'N/A' }}</span><br>
            <span>地点：{{ results[0].successorLocation || 'N/A' }}</span><br>
            <span>社会身份：{{ results[0].role || 'N/A' }}</span><br>
            <span>出现回目：{{ results[0].chapters || 'N/A' }}</span><br>
            <span>首见页码：{{ results[0].page || 'N/A' }}</span><br>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import * as echarts from 'echarts';

export default {
  data() {
    return {
      myChart: null,
      pictureSrc: '',
      baseURL: 'http://localhost:5000/api',
      results:[],
      profile:[],
      option: {
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
        title: {
          textStyle: {
            fontWeight: 'lighter',
          },
        },
        backgroundColor:'rgba(255, 255, 255, 0.8)',
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        legend: {
              x: 'center',
              y: 10,
              show: true,
              data: [
                  { name: '周', icon: 'circle',textStyle: { color: '#B81A35' } },
                  { name: '晋国',icon: 'circle', textStyle: { color: '#D77F66' } },
                  { name: '齐国',icon: 'circle', textStyle: { color: '#6A5B6D' } },
                  { name: '鲁国',icon: 'circle', textStyle: { color: '#FFD700' } },
                  { name: '吴国',icon: 'circle', textStyle: { color: '#E2A2AC' } },
                  { name: '越国',icon: 'circle', textStyle: { color: '#206864' } },
                  { name: '楚国',icon: 'circle', textStyle: { color: '#8B0111' } },
                  { name: '其他',icon: 'circle', textStyle: { color: '#BECAB7' } },
                ],
              textStyle: {
                color: '#000000',
                fontSize: 30,
                fontFamily: 'hongleixingshu,Microsoft YaHei, Arial'
              }
            },
        series: [
          {
            type: 'graph',
            layout: 'force',
            symbolSize: 100,
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [2, 4],
            edgeLabel: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 15,
                  fontFamily: 'hongleixingshu,Microsoft YaHei, Arial, sans-serif',
                },
                formatter: '{c}',
              },
            },
            force: {
              repulsion: 1500,
              edgeLength: [100, 300],
            },
            focusNodeAdjacency: true,
            draggable: true,
            roam: true,
            categories: [
                { name: '周', itemStyle: { color: 'rgba(106, 91, 109, 0.8)' } },
                { name: '晋国', itemStyle: { color: 'rgba(215,127,102, 0.8)' } },
                { name: '齐国', itemStyle: { color: 'rgba(106, 91, 109, 0.8)' } },
                { name: '鲁国', itemStyle: { color: 'rgba(255,215,0, 0.8)' } },
                { name: '吴国', itemStyle: { color: 'rgba(226,162,172, 0.8)' } },
                { name: '越国', itemStyle: { color: 'rgba(32,104,100, 0.8)' } },
                { name: '楚国', itemStyle: { color: 'rgba(188,212,231, 0.8)' } },
                { name: '其他', itemStyle: { color: 'rgba(190,202,183, 0.8)' } },
            ],
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 25,
                  fontFamily: 'hongleixingshu,Microsoft YaHei, Arial, sans-serif',
                },
              },
            },
            tooltip: {
              formatter(node) {
                if (!node.value) {
                  return node.data.name;
                } else {
                  return `${node.data.name}:${node.data.showNum}`;
                }
              },
            },
            lineStyle: {
              normal: {
                opacity: 1,
                width: 2,
                curveness: 0.3,
                color:"#ffffff"
              },
            },
            itemStyle: {
              opacity: 0.98, // 设置节点透明度
            },
            nodes: [],
            links: [],
          },
        ],
      },
    };
  },
  async mounted() {
    const characterName = this.$route.query.id;
    this.myChart = echarts.init(this.$refs.guanxi);
    this.myChart.showLoading();
    window.addEventListener('resize', this.myChart.resize);

    try {
      const response = await axios.get('/qa/search_name', {
        params: {
          name: characterName,
        }, baseURL: this.baseURL });

      const { data, links } = response.data[0];
      this.profile = response.data[1];
      const picture = response.data[2];  
      if (Array.isArray(data) && Array.isArray(links)) {
        this.option.series[0].nodes = data.map((node, idx) => {
          node.id = idx;
          return node;
        });
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
        console.log(this.profile["人物称谓（总）"]);
        this.option.series[0].links = links;
        this.myChart.setOption(this.option, true);
        this.pictureSrc = `data:image/jpg;base64,${picture}`;
        document.getElementById('picture').style.display = 'block';
      } else {
        console.error('Invalid response format:', response.data);
      }
    } catch (error) {
      if(error.response.status === 401)
      {
        this.$router.push({ path: '/login' })
      }
      console.error('Error fetching data:', error);
    }

    this.myChart.on('click', this.handleNodeClick);

    this.myChart.hideLoading();
  },
  methods: {
    async handleNodeClick(params) {
  const characterName = params.name;
  try {
    const response = await axios.get('/qa/get_profile', {
      params: {
        character_name: characterName,
      },
      baseURL: this.baseURL
     });

    const [profile, picture] = response.data;

    this.profile = profile;
    this.pictureSrc = `data:image/jpg;base64,${picture}`;
    document.getElementById('picture').style.display = 'block';

    // 更新 this.results
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
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
},
    goBack() {
      this.$router.push({ name: 'visualAll' });
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.myChart.resize);
    this.myChart.off('click', this.handleNodeClick);
    this.myChart.dispose();
  },
};
</script>

<style scoped>
#app {
  background-image:"../../static/input.png";
}

#profile {
  font-size: 20px;
  color: #ffffff;
  font-family: 'hongleixingshu';
  text-align: left;
  border: 5px outset #987001;
  margin-right: 10px;
  background-color: rgb(217, 188, 110,0.7);
  margin: auto;
  height: 350px; /* Fixed height */
  overflow-y: scroll; /* Add vertical scroll */
}

.image {
  position: absolute;
  top: 0;
  width: 100vw;
  height: 56.25vw;
}

h3 {
  font-family: hongleixingshu;
  text-align: left;
  color: #ffffff;
  font-size: 2.3em;
}

.group_3 {
  margin-top: 2.94rem;
  padding: 0 1.19rem;
}

.items-start {
  align-items: flex-start;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: url("../../static/input.png");
  background-size: cover;
  background-repeat: no-repeat;
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

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.relative {
  position: relative;
}

.content {
  display: flex;
  justify-content: space-around;
  width: 100%;
  align-items: flex-start;
  height:100%;
}

.graph-container {
  flex: 2;
  height: 800px; /* Set a specific height */
  width: 800px; /* Set a specific width */
  margin-top: 100px; /* Adjust the top margin */
  margin-left: 50px; /* Adjust the left margin */
  scale: 0.9;
}


.relative {
  position: relative;
}

.page {
  background-color: #ffffff;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}

.profile-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 50px; /* Move to the right */
  z-index: 2;
  margin-top: 10px; /* Move down */
  margin-right: 40px;
  align-items: flex-start;
}

.profile-picture {
  display: block;
  width: auto; /* Maintain aspect ratio */
  height: 300px; /* Fixed height */
  margin: auto; /* Center the image horizontally */
  z-index: 2;
  margin-top: -50px; /* Adjust the top margin here */
  scale: 0.8;
}


.pos {
  position: absolute;
  left: 50%;
  top: 1.99rem;
  transform: translateX(-50%);
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

.text_2 {
  color: #ffffff;
  font-size: 4.5rem;
  font-family: hongleixingshu;
  line-height: 3.6rem;
}

/* 按钮样式 */
.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #916634;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 40px;
  font-family: hongleixingshu, 'Microsoft YaHei', Arial, sans-serif;
}

.back-button:hover {
  background-color: #916634;
  color: #281704;
}
</style>
