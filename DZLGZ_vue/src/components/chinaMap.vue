<template>
    <div class="flex-col justify-start items-center relative page">
      <img
        class="background"
        src="../../static/background.png"
      />
      <span class="text text_3 pos_2" @click="goHome">《主页</span>
      <span class="text text_2 pos">远读</span>
      <div class="box">
        <button class="backBtn text text_4 pos_4" @click="back()">返回上级</button>
        <div id="mapChart" class="chart"></div>
      </div>
    </div>
  </template>
  
  <script>
  import cityMap from "@/js/china-main-city-map.js";
  import * as echarts from 'echarts';
  import axios from "axios";
  import Vue from "vue";
  // import registerAndsetOption from '@/js/echarts-map'
  
  //中国地图（第一级地图）的ID、Name、Json数据
  var chinaId = 100000;
  var chinaName = "china";
  var chinaJson = null;
  
  //记录父级ID、Name
  var mapStack = [];
  var parentId = null;
  var parentName = null;
  
  //Echarts地图全局变量，主要是在返回上级地图的方法中会用到
  var myChart = null;
  export default {
    name: "chinaMap",
    props: {
      msg: String
    },
    mounted: function() {
      this.mapChart("mapChart");
    },
    methods: {
      /**
       * 返回上一级地图
       */
       goHome() {
          this.$router.push({ name: 'homepage' });
        },
      back() {
        if (mapStack.length != 0) {
          //如果有上级目录则执行
          var map = mapStack.pop();
          axios
            .get("./static/json/map/" + map.mapId + ".json", {})
            .then(response => {
              const mapJson = response.data;
              registerAndsetOption(
                myChart,
                map.mapId,
                map.mapName,
                mapJson,
                false
              );
  
              //返回上一级后，父级的ID、Name随之改变
              parentId = map.mapId;
              parentName = map.mapName;
            });
        }
      },
      /**
       * Echarts地图
       */
  
      mapChart(divid) {
        axios.get("./static/json/map/" + chinaId + ".json", {}).then(response => {
          const mapJson = response.data;
          chinaJson = mapJson;
          myChart = echarts.init(document.getElementById(divid));
          registerAndsetOption(myChart, chinaId, chinaName, mapJson, false);
          parentId = chinaId;
          parentName = "china";
          myChart.on("click", function(param) {
            var cityId = cityMap[param.name];
            if (cityId) {
              //代表有下级地图
              axios
                .get("./static/json/map/" + cityId + ".json", {})
                .then(response => {
                  const mapJson = response.data;
                  registerAndsetOption(
                    myChart,
                    cityId,
                    param.name,
                    mapJson,
                    true
                  );
                });
            } else {
              //没有下级地图，回到一级中国地图，并将mapStack清空
              registerAndsetOption(myChart, chinaId, chinaName, chinaJson, false);
              mapStack = [];
              parentId = chinaId;
              parentName = chinaName;
            }
            // $.get('./asset/json/map/'+param.data.id+'.json', function (mapJson,status) {
  
            //     registerAndsetOption(myChart,param.data.id,param.name,mapJson,true)
  
            // }).fail(function () {
            //     registerAndsetOption(myChart,chinaId,'china',chinaJson,false)
            // });
          });
        });
      }
    }
  };
  /**
   *
   * @param {*} myChart
   * @param {*} id        省市县Id
   * @param {*} name      省市县名称
   * @param {*} mapJson   地图Json数据
   * @param {*} flag      是否往mapStack里添加parentId，parentName
   */
  
// 颜色数组
function registerAndsetOption(myChart, id, name, mapJson, flag) {
  echarts.registerMap(name, mapJson);
  myChart.setOption({
    backgroundColor: 'transparent',
    series: [
      {
        type: "map",
        map: name,
        zoom: 1.25,
        itemStyle: {
          normal: {
            borderColor: "#1dc199",
            borderWidth: 1
          }
        },
        data: initMapData(mapJson)
      }
    ]
  });

  if (flag) {
    mapStack.push({
      mapId: parentId,
      mapName: parentName
    });
    parentId = id;
    parentName = name;
  }
}

function initMapData(mapJson) {
  var mapData = [];
  for (var i = 0; i < mapJson.features.length; i++) {
    mapData.push({
      name: mapJson.features[i].properties.name,
      itemStyle: {
        normal: {
          // 为每个区域分配一个渐变色
          areaColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0, color: 'lightgreen' // 顶部颜色
          }, {
            offset: 1, color: 'darkgreen' // 底部颜色
          }])
        }
      }
    });
  }
  return mapData;
}
  </script>
  
  <style scoped>


  .title {
    width: 100%;
    height: 10vh;
    text-align: center;
    color: #fff;
    font-size: 2em;
    line-height: 10vh;
  }
  .box {
  position: absolute;
  width: 90%;
  height: 80vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0);
  align-items: center;
}
  
  .background {
  background-image: url("../../static/background.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

  .pos {
  position: absolute;
  left: 50%;
  top: 1.99rem;
  transform: translateX(-50%);
}

.pos_4 {
  position: absolute;
  left: 50%;
  top: 2.1rem;
  transform: translateX(-50%);
}


  .chart {
    position: relative;
    height: 90%;
    top: 10%;
    align-items: center;
  }
  .backBtn {
    position: absolute;
    top: 0;
    background-color: transparent;
    border: 0;
    color: #ffffff;
    font-family:hongleixingshu;
    cursor: pointer;
    text-align: center;
  }

  .myBlog {
    position: absolute;
    top: 2px;
    right: 5%;
    display: block;
    border: 2px solid #262a53;
  }
  .myBlog a {
    text-decoration: none;
    display: inline-block;
    color: #fff;
    padding: 5px;
    font-size: 1em;
  }
  
  .flex-col {
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
  position: absolute;
  left: 3.76rem;
  top: 3.27rem;
  cursor: pointer;
}


.text_2 {
  color: #ffffff;
  font-size:3.5rem;
  font-family: hongleixingshu;
  line-height: 3.6rem;
}


.text_4 {
  color: #ffffff;
  font-size:2.2rem;
  font-family: hongleixingshu;
  line-height: 3.6rem;
}

.justify-start {
  justify-content: flex-start;
}

.items-center {
  align-items: center;
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
  .myBlog a img {
    vertical-align: middle;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    margin: -5px 5px auto auto;
  }
  .bottom {
    position: absolute;
    width: 100%;
    height: 5%;
    line-height: 100%;
    left: 0;
    bottom: 0%;
    text-align: center;
  }
  </style>
  